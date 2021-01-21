//Grocery class: represent a item

class Grocery {
  constructor(itemName, qty) {
    this.itemName = itemName
    this.qty = qty
  }
}

//UI class: handle UI tasks

class UI {
  static displayItems() {
    const items = Store.getItem()

    items.forEach((item) => UI.addItemToList(item))
  }

  static addItemToList(item) {
    const list = document.querySelector("#grocery-list")

    const row = document.createElement("tr")

    row.innerHTML = `
            <td>${item.itemName}</td>
            <td>${item.qty}</td>
            
            <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>

        `
    list.appendChild(row)
  }

  static showAlert(message, className) {
    const div = document.createElement("div")
    div.className = `alert alert-${className}`
    div.appendChild(document.createTextNode(message))
    const container = document.querySelector(".container")
    const form = document.querySelector("#grocery-form")
    container.insertBefore(div, form)

    //remove in 3 seconds
    setTimeout(() => document.querySelector(".alert").remove(), 3000)
  }

  static clearFields() {
    document.querySelector("#itemName").value = ""
    document.querySelector("#qty").value = ""
  }

  static deleteItem(el) {
    if (el.classList.contains("delete")) {
      el.parentElement.parentElement.remove()
    }
  }
}

//Store class: handle storage

class Store {
  static getItem() {
    let items
    if (localStorage.getItem("items") === null) {
      items = []
    } else {
      items = JSON.parse(localStorage.getItem("items"))
    }

    return items
  }

  static addItem(item) {
    const items = Store.getItem()

    items.push(item)
    localStorage.setItem("items", JSON.stringify(items))
  }

  static removeItem(qty) {
    const items = Store.getItem()

    items.forEach((item, index) => {
      if (item.qty === qty) {
        items.splice(index, 1)
      }
    })

    localStorage.setItem("items", JSON.stringify(items))
  }
}

//Event: display item

document.addEventListener("DOMContentLoaded", UI.displayItems)

//Event: add a item

document.querySelector("#grocery-form").addEventListener("submit", (e) => {
  //Prevent default
  e.preventDefault()
  //Get form values
  const itemName = document.querySelector("#itemName").value
  const qty = document.querySelector("#qty").value

  //Validate
  if (itemName === "" || qty === "") {
    UI.showAlert("Please fill in all fields", "danger")
  } else {
    //Instantiate item
    const item = new Grocery(itemName, qty)

    //Add item to UI
    UI.addItemToList(item)

    //Add to local storage
    Store.addItem(item)

    //Clear fields
    UI.clearFields()
  }
})

//Event: remove a item
document.querySelector("#grocery-list").addEventListener("click", (e) => {
  //Remove item from UI
  UI.deleteItem(e.target)

  //Remove item from store
  Store.removeItem(e.target.parentElement.previousElementSibling.textContent)
})
