import express , {Request, Response} from 'express'
import productRouter from './routes/produts-routes'
import connectToDb from './config/mongoDb/connectToDb'

const app = express()
app.use(express.json())
connectToDb()
app.get('/' , (req : Request,res : Response) =>{
    res.send("hello world ravi")
})
app.use('/products' , productRouter)

app.listen(4003 , () =>[
    console.log("server running on http://localhost:4003")
])