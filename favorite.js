const getFavoriteList = () => {
    const test = sessionStorage.getItem("favoriteList")
    if (test) {
        return JSON.parse(test)
    }
    return null
}
const modal = document.getElementById("myModal");

const myGallery = () => {
    const favoriteList = getFavoriteList();
    console.log(favoriteList);
    $.each(favoriteList, function (i, item) {
        $("<div>").attr("id", "item" + i).appendTo("#collections");
        $("<img>").attr('id', "img" + i).attr("src", item.image).appendTo("#item" + i);
        $("<div>").attr("class", 'title').text(item.title).appendTo("#item" + i);
        $("<div>").attr("class", 'artist').text(item.artistName).appendTo("#item" + i);
        $("<div>").attr("id", "url" + item.id).attr("class", 'metURL').text("See detail page on MetMusem").appendTo("#item" + i);
        $("#url" + item.id).on('click', function () {
            var win = window.open(item.objectURL, '_blank');
            win.focus();
        })
        $("#img" + i).on('click', function () {
            $("#modalImage").attr("src", item.largeImage);
            $("#modalTitle").text(item.title);
            $("#modalArtist").text(item.artistName);
            modal.style.display = "block";
        })
        $(".close").on('click', function () {
            modal.style.display = "none";
        })
    })
    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
}
$(document).ready(myGallery());