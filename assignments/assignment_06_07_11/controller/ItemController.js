import {ItemModel} from "../model/ItemModel.js";
import {customer_db, item_db} from "../db/db.js";

// this variables for validations
var row_index = null;
const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
const sriLankanMobileNumberRegex = /^(\+94|0)[1-9][0-9]{8}$/;
const regEmail = new RegExp(emailPattern);
const regMobile = new RegExp(sriLankanMobileNumberRegex);

// --------------------------------------------------------------------------------
const clear = () => {
    $("#it_code").val("");
    $("#it_name").val("");
    $("#it_price").val("");
    $("#it_qty").val("");
}

// ----load item data----------------------------------------------------------------------------
const loadItemData = () => {
    $('#item-tbl-body').empty(); // make tbody empty
    item_db.map((item, index) => {
        let record = `<tr><td class="it_code">${item.it_code}</td><td class="it_name">${item.it_name}</td><td class="it_price">${item.it_price}</td><td class="it_qty">${item.it_qty}</td></tr>`;
        $("#item-tbl-body").append(record);
    });
};

// ----Submit----------------------------------------------------------------------------
$("#item-btns>button[type='button']").eq(0).on("click", () => {
    console.log("Hello-submit");
    let it_code = $("#item_code").val();
    let it_name = $("#item_name").val();
    let it_price = $("#item_price").val();
    let it_qty = $("#item_qty").val();

    if(it_code){
        if(it_name){
            if(it_price){
                if(it_qty){
                    let item_obj = new ItemModel(it_code, it_name, it_price, it_qty);
                    // save in the db
                    item_db.push(item_obj);

                    Swal.fire(
                        'Success!',
                        'Item has been saved successfully!',
                        'success'
                    )

                    // clear();
                    $("#item-btns>button[type='reset']").click();

                    // load customer data
                    loadItemData();
                }else{
                    Swal.fire({
                        icon: 'error',
                        title: 'Invalid Input',
                        text: 'Please enter Item Quantity'
                    })
                }
            }else{
                Swal.fire({
                    icon: 'error',
                    title: 'Invalid Input',
                    text: 'Please enter valid Item Price'
                })
            }
        }else{
            Swal.fire({
                icon: 'error',
                title: 'Invalid Input',
                text: 'Please enter Item Name'
            })
        }
    }else{
        Swal.fire({
            icon: 'error',
            title: 'Invalid Input',
            text: 'Please enter Item Code'
        })
    }

});

// ----Update----------------------------------------------------------------------------
$("#item-btns>button[type='button']").eq(1).on("click", () => {

    console.log("Hello-update");
    let it_code = $("#item_code").val();
    let it_name = $("#item_name").val();
    let it_price = $("#item_price").val();
    let it_qty = $("#item_qty").val();

    let item_obj = new ItemModel(it_code, it_name, it_price, it_qty);

    // find item index
    let index = item_db.findIndex(item => item.it_code === it_code);

    // update item in the db
    item_db[index] = item_obj;

    // clear();
    $("#item-btns>button[type='reset']").click();
    Swal.fire(
        'Success!',
        'Item has been updated successfully!',
        'success'
    )

    // load customer data
    loadItemData();
});

// ----Delete----------------------------------------------------------------------------
$("#item-btns>button[type='button']").eq(2).on("click", () => {

    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
        if (result.isConfirmed) {
            let it_code = $("#item_code").val();

            // find item index
            let index = item_db.findIndex(item => item.it_code === it_code);

            // remove the item from the db
            item_db.splice(index, 1);

            Swal.fire(
                'Deleted!',
                'Your file has been deleted.',
                'success'
            )

            $("#item-btns>button[type='reset']").click();

            // load customer data
            loadItemData();
        }
    })
})


// ----when click a row----------------------------------------------------------------------------
$("#item-tbl-body").on("click", "tr", function() {
    row_index = $(this).index();

    console.log(row_index);

    let it_code = $(this).find(".it_code").text();
    let it_name = $(this).find(".it_name").text();
    let it_price = $(this).find(".it_price").text();
    let it_qty = $(this).find(".it_qty").text();

    $("#item_code").val(it_code);
    $("#item_name").val(it_name);
    $("#item_price").val(it_price);
    $("#item_qty").val(it_qty);

});

function getAllItem() {
    return item_db;
}
//--------Search-----------------------------
$('#item_search').on('input' ,() => {
    let search_term = $('#item_search').val();

    let results = item_db.filter((item) =>
        item.it_code.toLowerCase().startsWith(search_term.toLowerCase()) || item.it_name.toLowerCase().startsWith(search_term.toLowerCase()));
    console.log(results);

    $('#item-tbl-body').empty();
    results.map((item, index) => {
        let tbl_row = `<tr><td>${item.it_code}</td><td>${item.it_name}</td><td>${item.it_price}</td><td>${item.it_qty}</td></tr>`;
        $('#item-tbl-body').append(tbl_row);
    });
});
