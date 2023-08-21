const { Pool } = require("pg");
const format = require('pg-format');
const pool = new Pool({
    host: 'localhost',
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE,
    port: process.env.PGPORT,
    allowExitOnIdle: true
});



const obtenerJoyas = async ({limits = 10, order_by = "id_ASC", page = 1}) => {

    const [campo, direccion] = order_by.split("_")
    const offset = (page - 1) * limits
    const formattedQuery = format("SELECT * FROM inventario ORDER BY %s %s LIMIT %s OFFSET %s", campo, direccion, limits, offset); 

    pool.query(formattedQuery);
    
    const {rows: inventario} = await pool.query(formattedQuery)
    return inventario
}


const obtenerJoyasPorFiltro = async ({ precio_min, precio_max, categoria, metal }) => {
    let filtros = []
    const values = []

    const agregarFiltro = (campo, comparador, valor) => {
        values.push(valor)
        const { length } = filtros
        filtros.push(`${campo} ${comparador} $${length + 1}`)
    }

    if (precio_min) agregarFiltro('precio', '>=', precio_min)
    if (precio_max) agregarFiltro('precio', '<=', precio_max)
    if (categoria) agregarFiltro('categoria', ' = ', categoria)
    if (metal) agregarFiltro('metal', ' = ', metal)

    let consulta = "SELECT * FROM inventario"

    if (filtros.length > 0) {
        filtros = filtros.join(" AND ")
        consulta += ` WHERE ${filtros}`
    }
    const { rows: inventario } = await pool.query(consulta, values)
    return inventario
    }



const prepararHATEOAS = (inventario) =>{
    const results = inventario.map ((m) => {
        return{
            name: m.nombre,
            href:  `/inventarios/inventario/${m.id}`,
        }
    }).slice(0, 6)
    const total = inventario.length
    const HATEOAS = {
        total, 
        results
    }
    return HATEOAS

}



module.exports = {obtenerJoyas, obtenerJoyasPorFiltro, prepararHATEOAS}