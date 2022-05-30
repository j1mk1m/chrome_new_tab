var entries = {},
    completed = {},
    shortcuts = {};

var reminder = {
    add : function (text) {
        if (text != '') {
            var key = Date.now();
            if (localStorage.entries){
                entries = JSON.parse(localStorage.entries);
            }
            entries[key] = text;
            localStorage.entries = JSON.stringify(entries);
            document.getElementById('enter').value = '';
            reminder.show();
        }
        document.getElementById('enter').focus();
    },
    show : function () {
        if (localStorage.entries) {
            entries = JSON.parse(localStorage.entries);
        }
        for (var key in entries) {
            var newSection = document.createElement('section'),
            textbox = document.createElement('input'),
            xbox = document.createElement('input');
    
            textbox.type = 'text';
            textbox.value = entries[key];
            textbox.setAttribute('onblur', 'reminder.edit(this.parentNode.id, this.value)');
            xbox.type = 'button';
            xbox.value = 'x';
            xbox.setAttribute('onclick', 'reminder.deleteTask(this.parentNode.id)');
    
            newSection.id = key;
            newSection.appendChild(textbox);
            newSection.appendChild(xbox);
            var body = document.getElementById("reminders");
            if (!document.getElementById(key)) {
                body.insertBefore(newSection, document.getElementById("section-userinput"));
            }
        }
    },
    edit : function (id, text) {
        entries = JSON.parse(localStorage.entries);
        entries[id] = text;
        localStorage.entries = JSON.stringify(entries);
    },
    deleteTask : function (id) {
        entries = JSON.parse(localStorage.entries);
        if (localStorage.completed){
            completed = JSON.parse(localStorage.completed);
        }
        completed[id] = entries[id];
        delete entries[id];
        localStorage.entries = JSON.stringify(entries);
        localStorage.completed = JSON.stringify(completed);
        reminder.show();
        document.getElementById(id).remove();
    }
}

var shortcut = {
    add : function () {
        var name = document.getElementById('name');
        var url = document.getElementById('url');
        if (name.value != "" && url.value != "") {
            if (localStorage.shortcuts) {
                shortcuts = JSON.parse(localStorage.shortcuts);
            }
            var key = Date.now();
            shortcuts[key] = [name.value, url.value];
            localStorage.shortcuts = JSON.stringify(shortcuts);
            name.value = "";
            url.value = "";
            shortcut.show();
        }
        document.getElementById("name").focus();
    },
    show : function () {
        if (localStorage.shortcuts){
            shortcuts = JSON.parse(localStorage.shortcuts);
        }
        for (var key in shortcuts) {
            var arr = shortcuts[key];
            var name = arr[0];
            var url = arr[1];

            var pannel = document.createElement("div");
            // pannel.className = "shortcut-pannel";
            pannel.id = key;

            // const xhttp = new XMLHttpRequest();
            // xhttp.onload = function() {
            //     var iconref = shortcut.findIcon(xhttp.responseXML);
            //     var image = document.createElement("img");
            //     image.src = iconref;
            //     pannel.appendChild(image);
            // }
            // xhttp.open("GET", "https://cors-anywhere.herokuapp.com/" + url);
            // xhttp.send();

            var link = document.createElement("a");
            link.href = url;
            link.innerHTML = name;

            var xbox = document.createElement("input")
            xbox.type = 'button';
            xbox.value = 'x';
            xbox.setAttribute('onclick', 'shortcut.remove(this.parentNode.id)');

            pannel.appendChild(link);
            pannel.appendChild(xbox);
            var body = document.getElementById("shortcut-pannels");
            if (!document.getElementById(key)){
                body.appendChild(pannel);
            }
        }
    },
    remove : function (id) {
        if (localStorage.shortcuts){
            shortcuts = JSON.parse(localStorage.shortcuts);
        }
        delete shortcuts[id];
        localStorage.shortcuts = JSON.stringify(shortcuts);
        shortcut.show();
        document.getElementById(id).remove();
    }
}
reminder.show();
shortcut.show();
