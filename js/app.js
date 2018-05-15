$(function () {

    var enterkeyUp=false;
    var count = 0;
    function updateCount(count) {
        $('.todo-count > strong').html(count);
    }

    $(document).on('click', '.filters > li', function () {
        var id = $(this).children().first();
        var fcount=count;
        enterkeyUp=true;
        $('.filters a').removeClass('selected');
        id.attr('class', 'selected');

        console.log(id);
        $('.todo-list li').each(function () {
            $(this).show();
        })

        var text = id.text();

        if (text == 'Active') {
            $('.todo-list li').each(function () {
                if ($(this).attr('class') == 'completed') {
                    fcount--;
                    $(this).hide();
                }
                updateCount(fcount);
            })
        } else if (text == 'Completed') {
            $('.todo-list li').each(function () {
                if ($(this).attr('class') != 'completed') {
                    $(this).hide();
                    fcount--;
                }
                updateCount(fcount);
            })
        }else if(text=='All' ){
            $('.todo-list li').each(function () {
                updateCount(count);
            })
        }
    })
function todoList() {
    var id = $(this).attr('id');
    $.ajax({
        url: 'http://localhost:8080/test',
        success: function (data) {
            $.each(data, function (index, item) {
                count++;
                updateCount(count);
                if (item['completed'] == 1) {
                    var complete = 'class=\"completed\"';
                    var check = 'checked';
                }
                else {
                    var complete = 'class =""';
                    var check = '';
                }
                $(".todo-list").append("<li id='" + item['id'] + "'" + complete + ">" +
                    "<div class=\"view\">" +
                    "<input class=\"toggle\" id='" + item['id'] + "' type=\"checkbox\" " + check + ">" +
                    "<label>" + item['todo'] + "</label>" +
                    "<button class=\"destroy\" id='" + item['id'] + "'></button>" +
                    "</div>" +
                    "<input class=\"edit\" value=\"Rule the web\">" +
                    "</li>");
            })

        }

    });
}

function deleteTodo() {
    $(document).on('click', '.destroy', function (event) {

        var id = $(this).attr('id');
        $.ajax({
            type: "delete",
            url: 'http://localhost:8080/test/' + id,
            contentType: "application/json",
            dataType: "json",
            success: function () {
                $("li").remove("#" + id);
                count--;
                updateCount(count)
            }

        })

    })
}

function clearCompleted() {
    $(document).on('click', '.clear-completed', function () {
        $('.todo-list li').each(function () {
            var id = $(this).attr("id");
            if ($(this).attr('class') == 'completed') {

                if (id != null) {
                    $.ajax({
                        type: "delete",
                        url: 'http://localhost:8080/test/' + id,
                        contentType: "application/json",
                        dataType: "json",
                        success: function () {
                            $("li").remove("#" + id);
                            count--;
                            updateCount(count)
                        }
                    })
                }
            }
        })

    })
}

function completed() {
    $(document).on('click', '.toggle', function (event) {
        var id = $(this).attr('id');
        if (id != null) {
            if ($(this).is(':checked')) {
                $(this).parent().parent().addClass("completed");
                $.ajax({
                    type: "put",
                    url: 'http://localhost:8080/test/' + id,
                    contentType: "application/json",
                    dataType: "json",
                    data: JSON.stringify({"completed": 1}),
                });
            }
            else {
                $(this).parent().parent().removeClass("completed");
                $.ajax({
                    type: "put",
                    url: 'http://localhost:8080/test/' + id,
                    contentType: "application/json",
                    dataType: "json",
                    data: JSON.stringify({"completed": 0}),
                });
            }
        }
    })

}

function create() {
    $(document).keyup(function (e) {
        if (e.which == 13) {
            if ($('.new-todo').val() != '') {

                if(enterkeyUp==true)
                    $('.todo-list li').show();
                enterkeyUp=false;
                var str = $('.new-todo').val();



                $.ajax({
                    type: "post",
                    url: 'http://localhost:8080/test',
                    contentType: "application/json",
                    dataType: "json",
                    data: JSON.stringify({"todo": str, "completed": 0}),
                    success: function (id) {
                        if (id != null) {
                            apendTodo(id);
                            $('.new-todo').val('');
                            count++;
                            updateCount(count)
                        }
                    }
                })
            }
            else alert('빈 값 입력 불가능');
        }
    })
}

function apendTodo(idnum) {
    $(".todo-list").prepend("<li id='" + idnum.id + "'" + completed + ">" +
        "<div class=\"view\">" +
        "<input class=\"toggle\" id='" + idnum.id + "' type=\"checkbox\">" +
        "<label>" + $('.new-todo').val() + "</label>" +
        "<button class=\"destroy\"id='" + idnum.id + "'></button>" +
        "</div>" +
        "<input class=\"edit\" value=\"Rule the web\">" +
        "</li>");
}

todoList();
create();
completed();
deleteTodo();
clearCompleted();

})