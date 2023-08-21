const express = require('express')
const app = express()
app.listen(3000, console.log('Server ON'))

require('dotenv').config()
const { obtenerJoyas, obtenerJoyasPorFiltro, prepararHATEOAS } = require('./consultas')

app.get('/joyas', async (req, res) => {
  const queryStrings = req.query
  const inventario = await obtenerJoyas(queryStrings)
  const HATEOAS = await prepararHATEOAS(inventario)
  res.json(HATEOAS)
})


app.get('/joyas/filtros', async (req, res)=>{
  const queryStrings = req.query
  const inventario = await obtenerJoyasPorFiltro (queryStrings)
  res.json(inventario)
})


app.get("*", (req, res)=>{
  res.status(404).send("esta ruta no existe")
})