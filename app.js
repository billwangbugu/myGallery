class ArtItem {
    constructor(id, title, artistName, image, largeImg, objectURL) {
        this.id = id;
        this.title = title;
        this.artistName = artistName;
        this.image = image;
        this.largeImage = largeImg;
        this.objectURL = objectURL
    }
}
class MyCollection {
    constructor() {
        const test = sessionStorage.getItem("favoriteList")
        if (test) {
            this.length = JSON.parse(test).length;
            this.data = JSON.parse(test);
        } else {
            this.length = 0;
            this.data = [];
        }
    }
    getIndex(id) {
        return this.data.filter(art => art.id === id)[0].indexOf()
    }

    addItem(art) {
        this.data.push(art);
        this.length++;
        this.updateStorage();
        this.checkFavoriteButton();
    }
    isItemFavorited(id) {
        return this.data.filter(art => art.id === id).length === 0 ? false : true;
    }
    removeItem(id) {
        const index = this.data.findIndex(art => art.id == id);
        if (index !== -1) {
            this.data.splice(index, 1)
            this.length--;
            this.updateStorage();
            this.checkFavoriteButton();
        }
    }
    updateStorage() {
        sessionStorage.setItem("favoriteList", JSON.stringify(this.data));
    }
    checkFavoriteButton() {
        if (this.length === 5) {
            $("#myFavorite").attr('href', './myGallery.html');
            $(".favorite").removeClass('disabled')
        } else {
            $("#myFavorite").removeAttr('href');
            $(".favorite").addClass('disabled');
        }
        $("#favoriteNum").text("( " + this.length + " )");
    }
}

const getCollection = () => {
    const collectionApi = "https://collectionapi.metmuseum.org/public/collection/v1/search?departmentId=11&q=sunflowers&hasImages=true";
    return $.getJSON(collectionApi)
}

const getArtItem = (objectId) => {
    const objectApi = "https://collectionapi.metmuseum.org/public/collection/v1/objects/" + objectId;
    return $.getJSON(objectApi)
}

const addFavoriteItem = (art) => {
    const myCollection = new MyCollection()
    if (myCollection.length < 5) {
        myCollection.addItem(art);
        return true;
    } else {
        alert('Sorry, you already selected 5 art items')
        return false;
    }
}

const removeFavorite = (id) => {
    const myCollection = new MyCollection()
    if (myCollection.length > 0) {
        myCollection.removeItem(id);
    }
}

const modal = document.getElementById("myModal");

const fetchCollectionList = () => {
    const myCollection = new MyCollection();
    myCollection.checkFavoriteButton();

    const collectionList = [];
    getCollection()
        .done(function (data) {
            $.each(data.objectIDs, function (i, item) {
                if (i < 25) {
                    $("<div>").attr("id", "item" + i).appendTo("#collections");
                    getArtItem(item)
                        .done((res) => {
                            const art = new ArtItem(item, res.title, res.artistDisplayName, res.primaryImageSmall, res.primaryImage, res.objectURL);
                            collectionList.push(art);
                            $("<img>").attr('id', "img" + i).attr("src", art.image).appendTo("#item" + i);
                            $("<div>").attr("class", 'title').text(art.title).appendTo("#item" + i);
                            $("<div>").attr("class", 'artist').text(art.artistName).appendTo("#item" + i);
                            $("<div>").attr("id", "url" + art.id).attr("class", 'metURL').text("See detail page on MetMusem").appendTo("#item" + i);
                            $("#url" + art.id).on('click', function () {
                                var win = window.open(art.objectURL, '_blank');
                                win.focus();
                            })
                            $("<div>").attr('id', 'favor' + art.id).appendTo("#item" + i);
                            $("<input>").attr('id', 'checkbox' + art.id).attr('type', 'checkbox').attr("value", art.id).appendTo('#favor' + art.id);
                            if (myCollection.isItemFavorited(art.id)) {
                                $("#checkbox" + art.id).prop("checked", true);
                            }
                            $("<label>").attr('for', 'checkbox' + art.id).text('add to favorite').appendTo('#favor' + art.id);
                            $('#checkbox' + art.id).on('change', function () {
                                if ($(this).is(':checked')) {
                                    const isAdded = addFavoriteItem(art);
                                    if (!isAdded) {
                                        $(this).prop("checked", false);
                                    }
                                } else {
                                    removeFavorite(art.id);
                                }

                            })
                            $("#img" + i).on('click', function () {
                                $("#modalImage").attr("src", art.largeImage);
                                $("#modalTitle").text(art.title);
                                $("#modalArtist").text(art.artistName);
                                modal.style.display = "block";
                            })
                            $(".close").on('click', function () {
                                modal.style.display = "none";
                            })
                        })

                } else {
                    return false;
                }

            })
        });
    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }

}

$(document).ready(fetchCollectionList());