// Storage control
const StorageCtrl = (function () {
    // public methods
    return {
        storeItem: function (item) {
            let items
            // check if any items in ls
            if (localStorage.getItem('items') === null) {
                items = []
                // push new item
                items.push(item)
                // set ls
                localStorage.setItem('items', JSON.stringify(items))
            } else {
                // get what is already in ls
                items = JSON.parse(localStorage.getItem('items'))
                // push new item
                items.push(item)
                //reset ls
                localStorage.setItem('items', JSON.stringify(items))
            }
        },
        getItemsFromStorage: function () {
            let items
            if (localStorage.getItem('items') === null) {
                items = []
            } else {
                items = JSON.parse(localStorage.getItem('items'))
            }
            return items
        },
        updateItemStorage: function (updatedItem){
            let items = JSON.parse(localStorage.getItem('items'))
            items.forEach((item, index)=>{
                if(updatedItem.id === item.id){
                    // remove previous item from LS and add updated item to LS
                    items.splice(index, 1, updatedItem)
                }
            })
            localStorage.setItem('items', JSON.stringify(items))
        },
        deleteItemFromStorage: function (id){
            let items = JSON.parse(localStorage.getItem('items'))
            items.forEach((item,index)=>{
                if(id === item.id){
                    items.splice(index,1)
                }
            })
            localStorage.setItem('items',JSON.stringify(items))
        },
        deleteAllItemsFromStorage: function (){
            localStorage.removeItem('items')
        }
    }
})()

// Item Controller
const ItemCtrl = (function () {
    // Item Constructor
    const Item = function (id,name, calories) {
        this.id = id
        this.name = name
        this.calories = calories
    }
    //Data structure
    const data = {
        items: StorageCtrl.getItemsFromStorage(),
        currentItem: null,
        totalCal: 0
    }

    return {
        getItems: function () {
            return data.items
        },
        addItem: function (name, calories) {
            let ID;
            // give ID a value
            if(data.items.length>0){
                ID = data.items[data.items.length-1].id + 1
            }else{
                ID = 0
            }
            //create new item
            const newItem = new Item(ID,name, parseInt(calories))
            //add items to array
            data.items.push(newItem)
            //return new item
            return newItem
        },
        getTotalCalories: function () {
            let total = 0
            // loop through items and add calories
            data.items.forEach(function (item) {
                total = total + item.calories
            })

            // set total calories in data structure
            data.totalCal = total
            console.log(data.totalCal)
            // return total
            return data.totalCal
        },
        getItemById: function (id) {
            // initialize returnable variable and set it as null
            found = null
            // loop until we find item we're looking for
            data.items.forEach((item) => {
                if (item.id === id) {
                    found = item
                }
            })
            return found
        },
        updateItem: function (name, calories) {
            // initialize returnable variable and set it as null
            let updatedItem = null;
            // loop until we find item we're looking for, change name and calorie values
            data.items.forEach((item) => {
                if (item.id === data.currentItem.id) {
                    item.name = name;
                    item.calories = parseInt(calories)
                    updatedItem = item
                }
            })
            return updatedItem
        },
        deleteItem: function (id){
            // get item ids
            const ids = data.items.map(function (item){
                return item.id
            })
            // get index
            const index = ids.indexOf(id)
            // remove item
            data.items.splice(index, 1)
        },
        deleteAll: function (){
          data.items = []
        },
        // giving currentItem a value
        setCurrentItem: function (item) {
            data.currentItem = item
        },
        // return currentItem for usage
        getCurrentItem: function () {
            return data.currentItem
        },
        logData: function () {
            return data
        }
    }
})()

// UI Controller
const UICtrl = (function () {

    //UI Selectors
    const UISelectors = {
        itemList: '#item-list',
        itemNameInput: '#item-name',
        itemCaloriesInput: '#item-calories',
        addBtn: '.add-btn',
        updateBtn: '.update-btn',
        deleteBtn: '.delete-btn',
        backBtn: '.back-btn',
        clearBtn: '.clear-btn',
        totalCalories: '.total-calories'
    }

    return {
        populateItemList: function (items) {
            // create html content
            let html = ''

            // parse data and create list items html
            items.forEach(function (item) {
                html += `<li class="collection-item" id="item-${item.id}">
                <strong>${item.name}:</strong> <em>${item.calories} Calories</em>
                <a href="#" class="secondary-content"><i class="edit-item fa fa-pencil"></i>
                </a>
                </li>`
            })
            // insert list items
            document.querySelector(UISelectors.itemList).innerHTML = html
        },
        clearEditState: function () {
            UICtrl.clearInput()
            document.querySelector(UISelectors.addBtn).style.display = 'inline';
            document.querySelector(UISelectors.updateBtn).style.display = 'none';
            document.querySelector(UISelectors.deleteBtn).style.display = 'none';
            document.querySelector(UISelectors.backBtn).style.display = 'none';
        },
        showEditState: function () {
            document.querySelector(UISelectors.addBtn).style.display = 'none';
            document.querySelector(UISelectors.updateBtn).style.display = 'inline';
            document.querySelector(UISelectors.deleteBtn).style.display = 'inline';
            document.querySelector(UISelectors.backBtn).style.display = 'inline';
        },
        getSelectors: function () {
            return UISelectors
        },
        getItemInput: function () {
            return {
                name: document.querySelector(UISelectors.itemNameInput).value,
                calories: document.querySelector(UISelectors.itemCaloriesInput).value
            }
        },
        addListItem: function (item) {
            // create li element
            const li = document.createElement('li')
            // add class
            li.className = 'collection-item'
            // add ID
            li.id = `item-${item.id}`
            // add HTML text
            li.innerHTML = `<strong>${item.name}: </strong>
                <em>${item.calories} Calories</em>
                <a href="#" class="secondary-content">
                <i class="edit-item fa fa-pencil"></i>
                </a>`
            // insert item
            document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend', li)
        },
        clearInput: function () {
            document.querySelector(UISelectors.itemNameInput).value = ''
            document.querySelector(UISelectors.itemCaloriesInput).value = ''
        },
        statusList: function (status) {
            document.querySelector(UISelectors.itemList).style.display = status
        },
        showTotalCalories: function (totalCalories) {
            document.querySelector(UISelectors.totalCalories).textContent = totalCalories
        },
        addItemToForm: function () {
            const currentItem = ItemCtrl.getCurrentItem()
            document.querySelector(UISelectors.itemNameInput).value = currentItem.name
            document.querySelector(UISelectors.itemCaloriesInput).value = currentItem.calories
            UICtrl.showEditState()
        },
        updateListItem: function (item) {
            let listItems = document.querySelectorAll('#item-list li')
            // turn listItems into array
            listItems = Array.from(listItems)
            listItems.forEach((listItem) => {
                const itemID = listItem.getAttribute('id')
                if (itemID === `item-${item.id}`) {
                    document.querySelector(`#${itemID}`).innerHTML=`<strong>${item.name}: </strong>
                    <em>${item.calories} Calories</em>
                    <a href="#" class="secondary-content">
                    <i class="edit-item fa fa-pencil"></i>
                    </a>`
                }
            })
        },
        deleteListItem: function (id){
            const itemID = `#item-${id}`
            const item = document.querySelector(itemID)
            item.remove()
        },
        removeAll: function (){
            let listItems = document.querySelectorAll('#item-list li')
            // turn listItems into array
            listItems = Array.from(listItems)
            // remove every item from array
            listItems.forEach((item)=>{
                item.remove()
            })
        },
        hideUI: function (){
            document.querySelector('#item-list li').style.display = 'none'
        }
    }
})()
// App Controller
const App = (function (ItemCtrl, StorageCtrl, UICtrl) {
    // Load event listeners
    const loadEventListeners = function () {
        // get UI Selectors
        const UISelectors = UICtrl.getSelectors()
        // add item event
        document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit)
        // edit icon click event
        document.querySelector(UISelectors.itemList).addEventListener('click', itemEditClick)
        // Update item click event
        document.querySelector(UISelectors.updateBtn).addEventListener('click', itemUpdateEdit)
        // Delete item event
        document.querySelector(UISelectors.deleteBtn).addEventListener('click',itemDeleteSubmit)
        // Delete all event
        document.querySelector(UISelectors.clearBtn).addEventListener('click', deleteAllItems)
        // Return to initial state
        document.querySelector(UISelectors.backBtn).addEventListener('click', function(e) {
            UICtrl.clearEditState()
            e.preventDefault()
        })
    }
    // add button event
    const itemAddSubmit = function (e) {
        // get form input from UI Controller
        const input = UICtrl.getItemInput()
        // check for name and calorie input
        if (input.name !== '' && input.calories !== '') {
            const newItem = ItemCtrl.addItem(input.name, input.calories)
            // Add new items to UI items list
            UICtrl.addListItem(newItem)
            // get total calories
            const totalCalories = ItemCtrl.getTotalCalories()
            // add total calories to UI
            UICtrl.showTotalCalories(totalCalories)
            // make list appear
            UICtrl.statusList("block")
            // store in localStorage
            StorageCtrl.storeItem(newItem)
            // Clear fields
            UICtrl.clearInput()
        }
        e.preventDefault()
    }
    // edit button event
    const itemEditClick = function (e) {
        if (e.target.classList.contains('edit-item')) {
            // Get list target item id (item-0, item-1 etc)
            const targetID = e.target.parentNode.parentNode.id;
            // Split item-id to only get target item id
            const targetIdArr = targetID.split('-')
            // Parse target item Id
            const id = parseInt(targetIdArr[1])
            // Get target item
            const targetItemToEdit = ItemCtrl.getItemById(id)
            // Set target item as current item
            ItemCtrl.setCurrentItem(targetItemToEdit)
            // add item to form
            UICtrl.addItemToForm()
        }
        e.preventDefault()
    }
    // update edited item function
    const itemUpdateEdit = function (e){
          const input = UICtrl.getItemInput()

          // update edited data
          const updatedTargetItem = ItemCtrl.updateItem(input.name, input.calories)
          // update item list in UI
          UICtrl.updateListItem(updatedTargetItem)
          // get total calories and update it
          const totalCalories = ItemCtrl.getTotalCalories()
          UICtrl.showTotalCalories(totalCalories)
          // update local storage
          StorageCtrl.updateItemStorage(updatedTargetItem)
          // clear form and revert to initial states
          UICtrl.clearEditState()

        e.preventDefault()
    }
    // delete button event
    const itemDeleteSubmit = function (e){
        // get current item id
        const currentItemID = ItemCtrl.getCurrentItem().id
        // delete said item from data
        ItemCtrl.deleteItem(currentItemID)
        // delete said item from UI
        UICtrl.deleteListItem(currentItemID)
        // refresh calorie count
        UICtrl.showTotalCalories(ItemCtrl.getTotalCalories())
        // delete said item from LS
        StorageCtrl.deleteItemFromStorage(currentItemID)

        UICtrl.clearEditState()
        e.preventDefault()
    }
    // delete all event
    const deleteAllItems = function() {
        // delete all items from data structure
        ItemCtrl.deleteAll();
        // refresh total calories
        UICtrl.showTotalCalories(ItemCtrl.getTotalCalories())
        // remove UI
        UICtrl.removeAll()
        // delete all items from LS
        StorageCtrl.deleteAllItemsFromStorage();
        // hide UI
        UICtrl.hideUI();
    }
    return {
        init: function () {
            console.log('Initializing App')
            // Setting initial state
            UICtrl.clearEditState()

            // fetch items from data structure
            const items = ItemCtrl.getItems()
            // Check to see, if there are any items
            if (items.length === 0) {
                UICtrl.statusList("none")
            } else {
                // Populate list with items
                UICtrl.populateItemList(items)

            }

            // Get total calories
            const totalCalories = ItemCtrl.getTotalCalories()
            // update UI total calories
            UICtrl.showTotalCalories(totalCalories)

            // load event listeners
            loadEventListeners()
        }
    }
})(ItemCtrl, StorageCtrl, UICtrl)

// Initialize App
App.init()