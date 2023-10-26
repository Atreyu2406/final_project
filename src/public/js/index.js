const socket = io()

const table = document.getElementById("realProductsTable")

document.getElementById("createdBtn").addEventListener("click", () => {
    const body = {
        title: document.getElementById("title").value,
        description: document.getElementById("description").value,
        price: document.getElementById("price").value,
        code: document.getElementById("code").value,
        stock: document.getElementById("stock").value,
        category: document.getElementById("category").value
    }
    fetch("/api/products", {
        method: "post",
        body: JSON.stringify(body),
        headers: {
            "Content-Type": "application/json"
        },
    })
        .then(result => result.json())
        .then(result => {
            if(result.status === "error") throw new Error(result.error)
        })
        .then(() => fetch("/api/products"))
        .then(result => result.json())
        .then(result => {
            if(result.status === "error") throw new Error(result.error)
            else socket.emit("productList", result.payload)
            console.log("Evento emitido: productList", result.payload);
            alert("Todo salió OK.")
            document.getElementById("title").value = ""
            document.getElementById("description").value = ""
            document.getElementById("price").value = ""
            document.getElementById("code").value = ""
            document.getElementById("stock").value = ""
            document.getElementById("category").value = ""
        })
        .catch(err => alert(`Ocurrió un error: ${err}`)) 
})

const deleteProduct = (id) => {
    fetch(`/api/products/${id}`, {
        method: "delete",
    })
        .then(result => result.json())
        .then(result => {
            if(result.status === "error") throw new Error(result.error)
            socket.emit("productList", result.payload)
            alert("OK")
        })
        .catch(err => alert(`ERROR: ${err}`))
}


// "listProducts" event received from the server
socket.on('updatedProducts', data => {
    table.innerHTML =
        `<tr>
            <td></td>
            <td><strong>Products</strong></td>
            <td><strong>Description</strong></td>
            <td><strong>Price</strong></td>
            <td><strong>Code</strong></td>
            <td><strong>Stock</strong></td>
            <td><strong>Category</strong></td>
        </tr>`
        console.log("info:", data)
        for(const product of data) {
            const tr = document.createElement("tr")
            tr.innerHTML =
                `<td><button class="btn btn-primary" onclick="deleteProduct(${product.id})"></button></td>
                <td>${product.title}</td>
                <td>${product.description}</td>
                <td>${product.price}</td>
                <td>${product.code}</td>
                <td>${product.stock}</td>
                <td>${product.category}</td>
                `
            table.getElementsByTagName("tbody")[0].appendChild(tr)
        }
});
