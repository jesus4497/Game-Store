const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { randomBytes } = require('crypto');
const { promisify } = require('util'); //transforms call backs into promises
const {transport,makeANiceEmail} = require('../mail');
const { hasPermission } = require('../utils');
const stripe = require('../stripe');

const Mutations = {
    
    async createItem(parent,args,ctx,info){  
        // Check if the user is logged
        if(!ctx.request.userId){
            throw new Error('No user found')
        }
        const item = await ctx.db.mutation.createItem({
            data:{
                ...args,
                user:{
                    //adding relationship in prisma
                    connect:{
                        id: ctx.request.userId
                    }
                }
            }
        }, info)
        return item
    },

    updateItem(parent, args, ctx,info){
        //copy the update
        const updates = {...args}
        //Do not update the ID
        delete updates.id
        //update method
        return ctx.db.mutation.updateItem({
            data:updates,
            where:{id: args.id}
        },info)
    },

    async deleteItem(parent,args,ctx,info){
        const where = {id: args.id}
        // find the item
        const item = await ctx.db.query.item({ where }, `{ id title user{ id }}`)
        // search if they own the item or have the Permission
        const ownsItem = item.user.id === ctx.request.userId;
        const hasPermission = ctx.request.user.permissions.some(permission => ['ADMIN','PERMISSIONUPDATE'].includes(permission))
        
        if(!ownsItem && !hasPermission){
            throw new Error("I'm sorry you don't have permissions to do this.")
        }

        // delete the item
        return ctx.db.mutation.deleteItem({where},info)
    },

    async signup(parent,args,ctx,info){
        args.email = args.email.toLowerCase().trim();
        //hash the password
        const password = await bcrypt.hash(args.password,10);
        //create the user in the database
        const user = await ctx.db.mutation.createUser({
            data:{
                ...args,
                password, // password: password
                permissions: { set: ['USER'] }
            }
        })

        //Create the JWT for them
        const token = jwt.sign({userId: user.id}, process.env.APP_SECRET);
        //We set the JWT as a cookie on the response
        ctx.response.cookie('token',token,{
            httpOnly:true,
            maxAge: 1000 * 60 * 60 * 24 * 365 //one year cookie life
        })
        //FINALLY we return the user to the browser
        return user;
    },
    
    async signin(parent,{ email, password },ctx,info){
        //check if the user exist
        const user = await ctx.db.query.user({ where: {email} });
        if(!user){
            throw new Error(`No user found for ${email}`)
        }
        //check if the passwords match
        const valid = await bcrypt.compare(password,user.password)
        if(!valid){
            throw new Error(`Invalid password`)
        }
        //create the JWT for the user
        const token = jwt.sign({userId: user.id}, process.env.APP_SECRET);
        //set the cookie
        ctx.response.cookie('token',token,{
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24 * 365 //one year cookie life
        })

        //return the user
        return user;
    },

    signout(parent,args,ctx,info){
        ctx.response.clearCookie('token');
        return {message: `See you!`}
    },

    async requestReset(parent,{email},ctx,info){
        //check if the email exists
        const user = await ctx.db.query.user({where: {email}})
        if(!user){
            throw new Error(`Such email do not exist: ${email}`)
        }
        //set a reset Token for the user
        const resetToken = (await promisify(randomBytes)(20)).toString('hex');
        const resetTokenExpery = Date.now() + 3600000 // 1 hour from now
        const res = await ctx.db.mutation.updateUser({
            where: {email},
            data: {
                resetToken,
                resetTokenExpery
            }
        })

        console.log(res)
        // send email
        const mailRes = await transport.sendMail({
            from:'jesus@jesus.com',
            to: user.email,
            subject:'New Password',
            html:makeANiceEmail(`Your password reset token is:\n\n <a href="${process.env.FRONTEND_URL}/reset?resetToken=${resetToken}">Click Here!</a>`)
        })
        return { message: 'Thanks'}

    },

    async resetPassword(parent,args,ctx,info){
        // check if the passwords match
        if(args.password !== args.confirmPassword){
            throw new Error('Your password do not match');
        }
        // check if its a legit reset token and if it is, check if its not expire
        const [user] = await ctx.db.query.users({
            where:{
                resetToken: args.resetToken,
                resetTokenExpery_gte: Date.now() - 3600000, //"gte" estands for greater or equeal
            }

        })
        if(!user){
            throw new Error('This token is either invalid or expired');
        }

        // hash the new password
        const password = await bcrypt.hash(args.password,10);
        // save new password to the user and remove old token fields
        const updatedUser = await ctx.db.mutation.updateUser({
            where:{id: user.id},
            data:{
                password,
                resetToken:null,
                resetTokenExpery:null
            }
        })

        // Generate JWT
        const token = jwt.sign({userId: updatedUser.id}, process.env.APP_SECRET);
        // Set the JWT to a cookie
        ctx.response.cookie('token',token,{
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24 * 365 //a year
        })
        // return the new user
        return updatedUser

    },

    async updatePermissions(parent,args,ctx,info){
        // check if they are logged in
        if(!ctx.request.userId){
            throw new Error('You must be logged in');
        }
        // Query the current user
        const user = await ctx.db.query.user({
            where:{
                id: ctx.request.userId
            }
        },info)
        // Check if they have permission to do this
        hasPermission(user, ['ADMIN','PERMISSIONUPDATE'])
        

        // Update the permissions

        return ctx.db.mutation.updateUser({
            data:{
                permissions:{ set: [...args.permissions] }
            },
            where:{
                id: args.id
            }
        },info)
    },

    async addToCart(parent,args,ctx,info){
        // 1. make sure they are sign in
        const { userId } = ctx.request
        if(!userId){
            throw new Error('You must be logged in');
        }
        // query the users cart
        const [existingCartItem] = await ctx.db.query.cartItems({
            where:{
                user:{id: userId},
                item:{id: args.id}
            }
            
        },info)
        // check if its already in the cart
        if(existingCartItem){
            return ctx.db.mutation.updateCartItem({
                where:{
                    id: existingCartItem.id
                },
                data:{
                    quantity:  existingCartItem.quantity + 1
                }
            })
        }
        
        // if its not create a fresh cart item for the user.
        return ctx.db.mutation.createCartItem({
            data:{
                user:{
                    connect:{
                        id: userId
                    }
                },
                item:{
                    connect:{
                        id: args.id
                    }
                }
            }
        },info)
    },

    async removeFromCart(parent,args,ctx,info){
        // find the cart item
        const cartItem = await ctx.db.query.cartItem({
            where:{
                id: args.id
            }
        },`{id, user{ id }}`);

        if(!cartItem) throw new Error('not such item found')
        // make sure they own the cart item
        if(cartItem.user.id !== ctx.request.userId){
            throw new Error('We couldn\'t find that item in your car');
        }
        // delete the card item
        return ctx.db.mutation.deleteCartItem({
            where:{
                id: args.id
            }
        },info)
    },

    async createOrder(parent,args,ctx,info){
        // query the current user and check if they are signed in
        const { userId } = ctx.request
        if(!userId){
            throw new Error('you must be logged in to to the checkout');
        }
        const user = await ctx.db.query.user({
            where:{
                id: userId
            },
        },`{ id name email cart { 
                id quantity item { 
                    title price description id image largeImage
                } 
            }}`)
        // recalculate the total for the price
        const amount = user.cart.reduce((tally,cartItem)=>
            tally + cartItem.item.price * cartItem.quantity
        ,0);
        // create the stripe charge (turn token into $$$$$$$$$$$$$$)
        const charge = await stripe.charges.create({
            amount,
            currency: 'USD',
            source: args.token
        })
        // convert the CartItems to OrderItems
        const orderItems = user.cart.map(cartItem =>{
            const orderItem = {
                ...cartItem.item,
                quantity: cartItem.quantity,
                user: {connect: { id: userId }},
                
            }
            delete orderItem.id
            return orderItem;
        })
        // create the order
        const order = await ctx.db.mutation.createOrder({
            data:{
                total: charge.amount,
                charge: charge.id,
                items: { create: orderItems },
                user: { connect: { id: userId } }
            }
        });
        // clean up - clear the users cart, delete cartItems
        const cartItemsId = user.cart.map(cartItem => cartItem.id);
        await ctx.db.mutation.deleteManyCartItems({
            where:{
                id_in: cartItemsId
            }
        })
        // return the order to the client
        return order
    }  

};
 
module.exports = Mutations;
