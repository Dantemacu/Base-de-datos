const menu = require('./menu.json');
const express = require('express');
const app = express();
app.use(express.json());
const PORT = 9000;

//Crear un endpoint GET /menu que devuelva el menú completo del restaurante.
app.get('/menu', (req, res) => {
    res.json(menu);
});




//Crear un endpoint GET /menu/:id que devuelva el plato con el id indicado.
app.get('/menu/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const plato = menu.find((plato) => plato.id == id);
    if (!plato) {
        res.status(404).json('Plato no encontrado');
    }
    res.json(plato);
});

//Crear un endpoint GET /combos que devuelva únicamente los combos del menú.
app.get('/combos', (req, res) => {
    const combos = menu.filter((plato) => plato.tipo == 'combo');
    res.json(combos);
});

//Crear un endpoint GET /principales que devuelva únicamente los platos principales del menú.
app.get('/principales', (req, res) => {
    const principales = menu.filter((plato) => plato.tipo == 'principal');
    res.json(principales);
});

//Crear un endpoint GET /postres que devuelva únicamente los postres del menú.
app.get('/postres', (req, res) => {
    const postres = menu.filter((plato) => plato.tipo == 'postre');
    res.json(postres);
});

//Crear un endpoint POST /pedido que reciba un array de id's de platos y devuelva el precio total del pedido. El array de platos debe ser pasado en el cuerpo de la petición. 
app.post('/pedido', (req, res) => {
    const { productos } = req.body;
    if (!Array.isArray(productos) || productos.length === 0) {
        return res.status(400).json('La solicitud debe incluir un array de platos o al menos un plato');
    }
    const pedido = productos.map(plato => {
        const menuPlato = menu.find(item => item.id === plato.id);
        if (menuPlato) {
            return menuPlato.precio * plato.cantidad;
        } else {
            return res.status(404).json("El id entregado no existe"); 
        }
    });

    const total = pedido.reduce((acc, subtotal) => acc + subtotal, 0);

    res.json({ msg: 'Pedido recibido', precio: total }); 


});


//Probar todos los endpoints creados utilizando REST Client.
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});