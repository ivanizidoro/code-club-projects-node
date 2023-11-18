const express = require('express')
const uuid = require('uuid')
const app = express()
const port = 3000

app.use(express.json())

const pedidos = []

const checkUserId = (request, response, next) => {
    const { id } = request.params

    const index = pedidos.findIndex(item => item.id === id)

    if (index < 0) {
        return response.status(404).json({ message: "User not found!!" })
    }

    request.pedidoId = index

    next()

}


const methodRequest = (request, response, next) => {
    console.log(`Tipo de requisição =>  ${request.method}`)
    console.log(`Url => ${request.url}`)
    request.statusPedido = "Em preparação"
    next()
}



app.post('/order', methodRequest, (request, response) => {

    const { order, clientName, price } = request.body

    let status = request.statusPedido

    const pedido = { id: uuid.v4(), order, clientName, price, status }

    pedidos.push(pedido)

    return response.status(201).json(pedido)

})

app.get('/order', methodRequest, (request, response) => {
    return response.json(pedidos)
})

app.put('/order/:id', checkUserId, methodRequest, (request, response) => {

    const { id } = request.params

    const { order, clientName, price, statusPedido } = request.body

    let status = request.statusPedido

    const index = request.pedidoId

    const newPedido = { id, order, clientName, price, status }

    pedidos[index] = newPedido

    return response.json(newPedido)

})

app.delete('/order/:id', methodRequest, checkUserId, (request, response) => {

    const index = request.pedidoId

    pedidos.splice(index, 1)

    return response.status(204).json()
})

app.get('/order/:id', checkUserId, methodRequest, (request, response) => {

    const index = request.pedidoId

    return response.json(pedidos[index])
})

app.patch('/order/:id', checkUserId, methodRequest, (request, response) => {

    const index = request.pedidoId

    pedidos[index].status = "pronto"

    console.log(pedidos[index].status)

    return response.json()
})


app.listen(port, () => {
    console.log('Server OnLine 🚀')
})