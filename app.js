$(function () {

    var collectionRef = db.collection("todolist");

    $(".form-control").keypress(function (e) {
        if (e.which == 13) {
            saveData()
        }
    });
    //點擊add-btn後

    $(".add-btn").on("click", function () {
        saveData()
    });

    function saveData() {
        //取得Input value並存成物件
        var $inputItem = $("#add-item");
        var $inputItemValue = $inputItem.val();
        var $itemColorValue = $(".color-dropdown").val();
        var item = {
            color: $itemColorValue,
            content: $inputItemValue,
            done: false
        };
        //儲存input value至firestore
        collectionRef.add(item)
            .then(function (docRef) {
                console.log("Document written with ID: ", docRef.id);
            })
            .catch(function (error) {
                console.error("Error adding document: ", error);
            });
        //游標停在input框並且呈現預設文字
        $inputItem.focus();
        $inputItem
            .val("")
            .attr("placeholder", "新增事項...");
    }
    //取得to-do-list-ul元素
    var $toDoListUl = $("#to-do-list-ul");
    //讀取資料庫內容
    //將每一筆資料繪製成li呈現至html裡的ul
    //check box-text-delete
    //依照done的狀態給予class done
    //依照color給予背景顏色
    db.collection("todolist").onSnapshot(function (snapshot) {
        snapshot.docChanges.forEach(function (change) {
            if (change.type === "added") {
                var $li = $(`<li class="content-li" id=${change.doc.id}><i class="far fa-trash-alt float-right del-btn"id=${change.doc.id}></i></li>`);
                var content = change.doc.data().content;
                $li.append(content);
                $li.appendTo($toDoListUl);
                if (change.doc.data().done) {
                    $li.addClass("done");
                }

                switch (change.doc.data().color) {
                    case "red":
                        $li.addClass("red");
                        break;
                    case "yellow":
                        $li.addClass("yellow");
                        break;
                    default:
                        $li.addClass("blue");
                }

                $li.click(function (e) {
                    db
                        .collection("todolist")
                        .doc(e.target.id)
                        .update({
                            done: !$li.hasClass("done")
                        });
                    $li.toggleClass("done");
                });

                var $delBtn = $(".del-btn");
                $delBtn.click(function (e) {
                    db
                        .collection("todolist")
                        .doc(e.target.id)
                        .delete();
                    $(`li#${e.target.id}`).remove();
                });
            }
        });
    });



});