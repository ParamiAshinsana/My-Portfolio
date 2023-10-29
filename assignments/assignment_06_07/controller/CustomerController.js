import {CustomerModel} from "../model/CustomerModel.js";
import {customer_db} from "../db/db.js";

// this variables for validations
var row_index = null;
const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
const sriLankanMobileNumberRegex = /^(\+94|0)[1-9][0-9]{8}$/;
const regEmail = new RegExp(emailPattern);
const regMobile = new RegExp(sriLankanMobileNumberRegex);

// --------------------------------------------------------------------------------
const clear = () => {
    $("#cust_id").val("");
    $("#cust_name").val("");
    $("#cust_mobile").val("");
    $("#cust_address").val("");

}
// ----load customer data----------------------------------------------------------------------------
const loadCustomerData = () => {
    $('#customer-tbl-body').empty(); // make tbody empty
    customer_db.map((item, index) => {
        let record = `<tr><td class="cust_id">${item.cust_id}</td><td class="cust_name">${item.cust_name}</td><td class="cust_mobile">${item.cust_mobile}</td><td class="cust_address">${item.cust_address}</td></tr>`;
        $("#customer-tbl-body").append(record);
    });
};
// ----Submit----------------------------------------------------------------------------
$("#customer-btns>button[type='button']").eq(0).on("click", () => {
    console.log("Hello-submit");
    let cust_id = $("#id").val();
    let cust_name = $("#customer_name").val();
    let cust_mobile = $("#customer_mobile").val();
    let cust_address = $("#customer_address").val();

    if(cust_id){
        if(cust_name){
            var mobileValid = regMobile.test(cust_mobile);

          if(cust_mobile && mobileValid){
              if(cust_address){
                  let customer_obj = new CustomerModel(cust_id, cust_name, cust_mobile, cust_address);
                  // save in the db
                  customer_db.push(customer_obj);

                  Swal.fire(
                      'Success!',
                      'Customer has been saved successfully!',
                      'success'
                  )

                  // clear();
                  $("#customer-btns>button[type='reset']").click();

                  // load customer data
                  loadCustomerData();
              }else{
                  Swal.fire({
                      icon: 'error',
                      title: 'Invalid Input',
                      text: 'Please enter Customer Address'
                  })
              }
          }else{
              Swal.fire({
                  icon: 'error',
                  title: 'Invalid Input',
                  text: 'Please enter valid Customer Mobile'
              })
          }
        }else{
            Swal.fire({
                icon: 'error',
                title: 'Invalid Input',
                text: 'Please enter Customer Name'
            })
        }
    }else{
        Swal.fire({
            icon: 'error',
            title: 'Invalid Input',
            text: 'Please enter Customer Id'
        })
    }

});

// ----Update----------------------------------------------------------------------------
$("#customer-btns>button[type='button']").eq(1).on("click", () => {

    console.log("Hello-update");
    let cust_id = $("#id").val();
    let cust_name = $("#customer_name").val();
    let cust_mobile = $("#customer_mobile").val();
    let cust_address = $("#customer_address").val();


    let customer_obj = new CustomerModel(cust_id, cust_name, cust_mobile, cust_address);

    // find item index
    let index = customer_db.findIndex(item => item.cust_id === cust_id);

    // update item in the db
    customer_db[index] = customer_obj;

    // clear();
    $("#customer-btns>button[type='reset']").click();
    Swal.fire(
        'Success!',
        'Customer has been updated successfully!',
        'success'
    )

    // load customer data
    loadCustomerData();
});


// ----Delete----------------------------------------------------------------------------
$("#customer-btns>button[type='button']").eq(2).on("click", () => {

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

            let cust_id = $("#id").val();

            // find item index
            let index = customer_db.findIndex(item => item.cust_id === cust_id);

            // remove the item from the db
            customer_db.splice(index, 1);

            Swal.fire(
                'Deleted!',
                'Your file has been deleted.',
                'success'
            )

            $("#customer-btns>button[type='reset']").click();

            // load customer data
            loadCustomerData();
        }
    })
})

// ----when click a row----------------------------------------------------------------------------
$("#customer-tbl-body").on("click", "tr", function() {
    row_index = $(this).index();

    console.log(row_index);

    let cust_id = $(this).find(".cust_id").text();
    let cust_name = $(this).find(".cust_name").text();
    let cust_mobile = $(this).find(".cust_mobile").text();
    let cust_address = $(this).find(".cust_address").text();

    $("#id").val(cust_id);
    $("#customer_name").val(cust_name);
    $("#customer_mobile").val(cust_mobile);
    $("#customer_address").val(cust_address);

});

//--------Search-----------------------------
$('#customer_search').on('input' ,() => {
    let search_term = $('#customer_search').val();

    let results = customer_db.filter((item) =>
        item.cust_name.toLowerCase().startsWith(search_term.toLowerCase()) || item.cust_mobile.toLowerCase().startsWith(search_term.toLowerCase())
        || item.cust_address.toLowerCase().startsWith(search_term.toLowerCase()));
    console.log(results);

    $('#customer-tbl-body').empty();
    results.map((item, index) => {
        let tbl_row = `<tr><td>${item.cust_id}</td><td>${item.cust_name}</td><td>${item.cust_mobile}</td><td>${item.cust_address}</td></tr>`;
        $('#customer-tbl-body').append(tbl_row);
    });
});