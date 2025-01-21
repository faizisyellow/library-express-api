import { PrismaClient } from "@prisma/client";

export interface CreateBook{
    bookId: string
    userId:string
 }

const prismaClient = new PrismaClient();

async function CreateBorrowBook(req:CreateBook) {

    try {
        await prismaClient.borrowing.create({
        data: {
            bookId: req.bookId,
            userId: req.userId
        }
      })
    } catch (error) {
        throw new Error(error as string)
    }
  
}

async function GetBorrowBook() {
try {
       const borrows = await prismaClient.borrowing.findMany({
       select: {
           id: true,
           borrowDate: true,
           returnDate: true,
           status: true,
           book: {
               select: {
                   id: true,
                   title: true,
                   author: true,
                   coverImage:true
               }
               },
               user: {
                   select: {
                       id:true,
                       username: true,
               }
           }
       }
    })

   return borrows
} catch (error) {
    throw new Error(error as string)
}
}


const ReturnBook = async (borrowId: string) => {
    const currentdate = new Date(); 
    try {
        await prismaClient.borrowing.update({
            where: {
                id: borrowId,
            },
            data: {
                status: "returned",
                returnDate:currentdate  
            }
        })
    } catch (error) {
        throw new Error(error as string)
    }
}


export const borrowingService = {
    CreateBorrowBook,
    GetBorrowBook,
    ReturnBook
};