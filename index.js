const express = require('express');//requerimos el servidor
const path = require('path');
const fs = require('fs/promises');
const pathJson = path.resolve('./file/tasks.json');
const app = express();//creamos nuestro servidor con esta instruccion
//instalamos nodemon con npm i -D nodemon y luego creamos
//el archivo que correra la aplicacion "dev":"nodemon index.js",
//luego corremos el script de desarrollo con: npm run dev
app.use(express.json());//es  un middlewaer incorporado, y lo utilzo para el post, update,etc
//me convierte el json que venga a un objeto, ya no tengo que converir la peticion a objeto
app.get('/tasks',async(req,res)=>{//indicamos la ruta, y una funcion callback  con 2 parametros req y res
    const jsonFile = await fs.readFile(pathJson,'utf-8');//indicamos la ruta que sera leida
    res.send(jsonFile);
    res.end();
});
//crear usuarios, metodo POST
app.post('/tasks', async(req,res)=>{
    const user = req.body;//en user ya esta el objeto de la peticion
    const toDoArray = JSON.parse(await fs.readFile(pathJson,'utf8'));//leemos el arreglo desde fs
    // console.log(toDoArray);//mostramos el arreglo
    const lastIndex = toDoArray.length - 1;//hallo la ultima posicion del arreglo
    const toDoId = toDoArray[lastIndex].id + 1;//le aumentamos 1 al ultimo objeto 
    toDoArray.push({...user,id:toDoId});//agregar el usuario al array, por destructuring
    // console.log(toDoArray);//visualizamos que quedo agregado el usuario
    await fs.writeFile(pathJson,JSON.stringify(toDoArray));
    res.end();
});
//update ToDo
app.put('/tasks',async(req,res)=>{
    const user = req.body;//peticion que hay en el body
    console.log(user);
    const toDoArray = JSON.parse(await fs.readFile(pathJson,'utf-8'));
    const todoUpdate = toDoArray.map((todo)=>{
        if(todo.id===user.id){
            todo=user
        }
        return todo
    });
    await fs.writeFile(pathJson,JSON.stringify(todoUpdate));
    res.end();
});
//delete ToDo
app.delete('/tasks',async(req,res)=>{
    const user = req.body;//en user queda guardada la solicitud del body
    const toDoArray = JSON.parse(await fs.readFile(pathJson,'utf8'))//leo la ruta y codificacion y paso el json a un objeto
    const deleteToDo = toDoArray.filter((todo)=>{
        return todo.id!==user.id
    });
    await fs.writeFile(pathJson,JSON.stringify(deleteToDo));
    res.end();
});
const PORT = 3000;
app.listen(PORT,()=>{
    console.log(`servidor escuchando en el puerto${PORT}`);
});




