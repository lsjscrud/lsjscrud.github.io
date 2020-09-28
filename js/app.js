getMembers = () => {
    // function getMembers() {
    let memberRecord = localStorage.getItem("members");
    if (!memberRecord)
        return [];
    else
        return JSON.parse(memberRecord);
}
calculateAge = date => {
    var today = new Date();
    var birthDate = new Date(date);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate()))
        age--;
    return age;
}
getTableData = () => {
    $("#member_table").find("tr:not(:first)").remove();
    var searchKeyword = $('#member_search').val();
    var filteredMembers = getMembers().filter(item => {
        return item.first_name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
            item.last_name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
            item.email.toLowerCase().includes(searchKeyword.toLowerCase()) ||
            item.designation.toLowerCase().includes(searchKeyword.toLowerCase())
    });
    if (!filteredMembers.length)
        $('.show-table-info').removeClass('hide');
    else
        $('.show-table-info').addClass('hide');
    filteredMembers.forEach((item, index) => {
        insertIntoTableView(item, index + 1);
    })
}
insertIntoTableView = (item, tableIndex) => {
    let row = $('#member_table')[0].insertRow();
    row.insertCell(0).innerHTML = tableIndex;
    row.insertCell(1).innerHTML = item.first_name;
    row.insertCell(2).innerHTML = item.last_name;
    row.insertCell(3).innerHTML = item.email;
    row.insertCell(4).innerHTML = new Date(item.d_o_b).toLocaleDateString('vi', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    row.insertCell(5).innerHTML = calculateAge(item.d_o_b);
    row.insertCell(6).innerHTML = '<a class="tag">' + item.designation + '</a>';
    let guid = item.id;
    row.insertCell(7).innerHTML = '<button class="btn btn-sm btn-default" onclick="showMemberData(' + guid + ')">View</button> ' +
        '<button class="btn btn-sm btn-primary" onclick="showEditModal(' + guid + ')">Edit</button> ' +
        '<button class="btn btn-sm btn-danger" onclick="showDeleteModal(' + guid + ')">Delete</button>';
    row.insertCell(8).innerHTML = guid;
}

(() => {
    getTableData();
    $("#d_o_b").datepicker({
        changeMonth: true,
        changeYear: true,
        yearRange: '1975:2020',
    });
    $("#edit_d_o_b").datepicker({
        changeMonth: true,
        changeYear: true,
        yearRange: '1975:2020',
    })
})();
var option = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
}
console.log(document.getElementById('thu'))
console.log($('#thu'))
console.log($('#thu')[0])
guid = () => parseInt(Date.now() + Math.random());
let dup = arr => arr.filter((item, index) => arr.indexOf(item) != index)
checkEmail = (mems) => {
    let emailArr = []
    for (const mem of mems)
        emailArr.push(mem['email']);
    return Object.keys(dup(emailArr)).length
}
capitalLetter = (str) => {
    str = str.split(" ");
    for (const i in str)
        if (str.hasOwnProperty(i))
            str[i] = str[i][0].toUpperCase() + str[i].substr(1);
    return str.join(" ");
}
saveMemberInfo = () => {
    let obj = {};
    ['first_name', 'last_name', 'email', 'd_o_b', 'designation'].forEach(item => {
        let result = $('#' + item)[0].value;
        if (result) {
            if (item == 'first_name' || item == 'last_name' || item == 'designation')
            // obj[item] = result.replace(/\w\S*/g, (w) => (w.replace(/^\w/, (c) => c.toUpperCase()))); // với Eng thì đc
                obj[item] = capitalLetter(result);
            else obj[item] = result;
        }
    });
    let members = getMembers();
    if (!members.length)
        $('.show-table-info').addClass('hide');
    if (Object.keys(obj).length) {
        obj.id = guid();
        members.push(obj);
        if (checkEmail(members)) {
            alert('Dia chi email nay da ton tai')
            return
        }
        localStorage.setItem("members", JSON.stringify(members));
        $('#input_form')[0].reset();
        // obj.d_o_b = calculateAge(obj.d_o_b);
        insertIntoTableView(obj, $('#member_table')[0].rows.length);
        $('#addnewModal').modal('hide')
    }
}

getFormattedMembers = () => {
    var members = getMembers();
    members.forEach(item => {
        item.d_o_b = calculateAge(item.d_o_b);
    });
    return members;
}
showMemberData = id => {
    let member = getMembers().find(item => {
        return item.id == id;
    })
    $('#show_first_name').val(member.first_name);
    $('#show_last_name').val(member.last_name);
    $('#show_email').val(member.email);
    $('#show_d_o_b').val(new Date(member.d_o_b).toLocaleDateString('vi', option));
    $('#show_designation').val(member.designation);
    $('#showModal').modal();
}

showEditModal = id => {
    let member = getMembers().find(item => {
        return item.id == id;
    })
    $('#edit_first_name').val(member.first_name);
    $('#edit_last_name').val(member.last_name);
    $('#edit_email').val(member.email);
    $('#edit_d_o_b').val(new Date(member.d_o_b).toLocaleDateString('vi', option));
    $('#edit_designation').val(member.designation);
    $('#member_id').val(id);
    $('#editModal').modal();
}

updateMemberData = () => {
    let allMembers = getMembers();
    let member = allMembers.find(item => {
        return item.id == $('#member_id').val();
    })
    member.first_name = capitalLetter($('#edit_first_name').val());
    member.last_name = capitalLetter($('#edit_last_name').val());
    member.email = $('#edit_email').val();
    member.d_o_b = $('#edit_d_o_b').val();
    member.designation = capitalLetter($('#edit_designation').val());
    if (checkEmail(allMembers)) {
        alert('Dia chi email nay da ton tai')
        return
    }
    localStorage.setItem('members', JSON.stringify(allMembers));
    $("#member_table").find("tr:not(:first)").remove();
    getTableData();
    $('#editModal').modal('hide')
}

showDeleteModal = id => {
    $('#deleted-member-id').val(id);
    $('#deleteDialog').modal();
    // $('#btnDelete')[0].focus();
    document.getElementById('btnDelete').focus();
}

deleteMemberData = () => {
    localStorage.setItem('members', JSON.stringify(
        JSON.parse(localStorage.getItem('members')).filter(item => {
            return item.id != $('#deleted-member-id').val();
        })
    ));
    $("#member_table").find("tr:not(:first)").remove();
    $('#deleteDialog').modal('hide');
    getTableData();
}

sortBy = type => {
    $("#member_table").find("tr:not(:first)").remove();
    var totalClickOfType = parseInt(localStorage.getItem(type));
    if (!totalClickOfType) {
        totalClickOfType = 1;
        localStorage.setItem(type, totalClickOfType);
    } else {
        if (totalClickOfType == 1)
            totalClickOfType = 2;
        else
            totalClickOfType = 1;
        localStorage.setItem(type, totalClickOfType);
    }
    // var searchKeyword = $('#member_search').val();
    // var members = getFormattedMembers();
    var sortedMembers = getMembers().sort(function(a, b) {
        return (totalClickOfType == 2) ? a[type] > b[type] : a[type] < b[type];
    });
    sortedMembers.forEach((item, index) => {
        insertIntoTableView(item, index + 1);
    })
}