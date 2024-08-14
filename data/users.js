const users=[
    {
        username:"admin ",
        password:"123",
    }
]


export const getUsers=username=>{
    const user=users.find(user=>user.username===username)
    return user
}