var db = []; //array of records
var index = 0; //ID record counter

//add row to contact list
function addRow(item) {
  const row = `<tr>
                  <td width="45%">${item.name}</td>
                  <td width="45%">${item.surname}</td>
                  <td width="10%" data-id="${item.id}">
                   <span class="delFromTable">
                    <i class="fas fa-trash-alt trash"></i>
                   </span>
                   <span class="rowInfo">
                    <i class="fas fa-info"></i>
                   </span> 
                </td>
              <tr>`;
  const tr = $(".tbl").append(row);
}

// REFRESH FIELDS ON START, ON CLICK AND AFTER ADDING
function refreshTable(database) {
  $(".tbl tr td").remove();
  for (let i = 0; i < database.length; i++) {
    addRow(database[i]);
  }
}

// CLEAR FIELDS
function resetForm() {
  const nameField = $("#name").val("");
  const surnameField = $("#surname").val("");
  const emailField = $("#email").val("");
  const phoneField = $("#phone").val("");
  const searchField = $("#search-input").val("");
}

//INITIALIZATION (RUNS ONLY ONCE)
$(document).ready(function () {
  refreshTable(db);

  // SEARCH BUTTON
  $("#search-input").keyup(function (event) {
    var value = $(event.target).val(); // search input string

    let foundItems = db.filter(
      (item) =>
        item.name.includes(value) ||
        item.surname.includes(value) ||
        item.email.includes(value) ||
        item.phone.includes(value)
    );

    refreshTable(foundItems);
    return false;
  });
  //display on the left found items
  $(document).on("click", "span.rowInfo", function (event) {
    const rowId = $(event.target).parent().parent().data("id");
    const infoItems = db.filter((item) => item.id == rowId);
    const infoItem = infoItems[0];
    $("#name").val(infoItem["name"]);
    $("#surname").val(infoItem["surname"]);
    $("#email").val(infoItem["email"]);
    $("#phone").val(infoItem["phone"]);
  });

  //DELETE SINGLE RECORD
  $(document).on("click", "span.delFromTable", function () {
    const rowId = $(event.target).parent().parent().data("id");
    const notFoundItems = db.filter((item) => item.id != rowId);
    db = notFoundItems;
    refreshTable(db);
  });

  //ADD RECORD
  $(".addButton").click(function (e) {
    const nameField = $("#name").val();
    const surnameField = $("#surname").val();
    const emailField = $("#email").val();
    const phoneField = $("#phone").val();
    const record = {
      id: index++,
      name: nameField,
      surname: surnameField,
      email: emailField,
      phone: phoneField
    };

    e.preventDefault(); // prevent page reload

    if (!validate()) {
      return false;
    }
    //addRow(record);
    db.push(record);
    refreshTable(db);
    resetForm();

    return false; // not sending data to the server
  });

  $(".clrButton").click(function () {
    resetForm();
    return false;
  });
});

function validate() {
  const rules = {
    name: {
      required: true,
      minlength: 2
    },
    surname: {
      required: true,
      minlength: 2
    },
    email: {
      required: true,
      email: true
    },
    phone: {
      digits: true,
      minlength: 10
    }
  };

  let errors = [];
  for (let ruleKey in rules) {
    const selector = `#${ruleKey}`; // #name
    const currentFieldValue = $(selector).val();
    // require rule
    if ("required" in rules[ruleKey]) {
      if (currentFieldValue.length === 0) {
        errors.push(`${ruleKey} Field can't be empty`);
      }
    }
    // min length
    const ruleLen = rules[ruleKey]["minlength"];
    if ("minlength" in rules[ruleKey]) {
      if (currentFieldValue.length < ruleLen) {
        errors.push(
          `${ruleKey}: Please enter at least ${ruleLen} characters/digits`
        );
      }
    }
    // email
    if ("email" in rules[ruleKey]) {
      // if settings is true
      if (rules[ruleKey]["email"] == true) {
        if (currentFieldValue.indexOf("@") == -1) {
          errors.push(`${ruleKey}: Invalid address`);
        }
      }
    }
  }
  // show errors
  for (let index in errors) {
    alert(errors[index]);
  }
  return errors.length == 0; // no error?
}
