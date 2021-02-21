//map
const map = L.map('mapid').setView([52.08486298060644, 23.683443581823557], 14);
const mainMap = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &&copy; <a href=https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1Ijoib2xsYXBvdGFwY2h1ayIsImEiOiJja2wxdXZvcjMwMXl4MnByMXRtbnowYWdzIn0.aFpsmhcdVOodC12uaLe5fA'
}).addTo(map);


//markers
const PersonalIcons = L.Icon.extend({
    options: {
        iconSize: [45, 45],
        popupAnchor: [0, -20]
    }
})
const redMarker = new PersonalIcons({iconUrl: 'image/icon/redMarker.png'}),
    blueMarker = new PersonalIcons({iconUrl: 'image/icon/blueMarker.png'}),
    violetMarker = new PersonalIcons({iconUrl: 'image/icon/violetMarker.png'}),
    pinkMarker = new PersonalIcons({iconUrl: 'image/icon/pinkMarker.png'}),
    greenMarker = new PersonalIcons({iconUrl: 'image/icon/greenMarker.png'}),
    lightgreenMarker = new PersonalIcons({iconUrl: 'image/icon/lightgreenMarker.png'}),
    bluegreenMarker = new PersonalIcons({iconUrl: 'image/icon/bluegreenMarker.png'}),
    purpulMarker = new PersonalIcons({iconUrl: 'image/icon/purpulMarker.png'}),
    orangeMarker = new PersonalIcons({iconUrl: 'image/icon/orangeMarker.png'})


const tab1 = document.querySelector('.tab-1');
const tab2 = document.querySelector('.tab-2');
const tab3 = document.querySelector('.tab-3');
const tab4 = document.querySelector('.tab-4');
const tab5 = document.querySelector('.tab-5');
const userList = document.querySelector('.containerUser');
const divDownField = document.createElement('div');
const enter = document.getElementById('enter');
const registration = document.getElementById('registration');
const enterFormDiv = document.getElementById('headerBlock');
const divBlocked = document.getElementById('blocked');
const mainUserList = document.getElementById('userList');
let currentUserId;
let currentObjectsArr = [];
let routeElement = [];
let ownMarkers = [];
let chosenMarkers = [];
let chosenContainers = [];
let objectsClass = [];
const delMarkerGreen = document.getElementById('deleteGreenMarker');
const delMarkerViolet = document.getElementById('deleteVioletMarker');
const delMarkerPink = document.getElementById('deletePinkMarker');
const delMarkerLightGreen = document.getElementById('deleteLightGreenMarker');
const delMarkerPurpul = document.getElementById('deletePurpulMarker');
const showMarkerBlue = document.getElementById('showBlueMarker');
const delMarkerArr = [delMarkerGreen, delMarkerViolet, delMarkerPink, delMarkerLightGreen, delMarkerPurpul, showMarkerBlue];

//Заполнение Левого поля объектами
fetch(`data/data.json`)
    .then(response => response.json())
    .then(data => {
            console.log(data);
            //sights
            let sights = new ObjectsBrest(delMarkerGreen);
            sights.addAllObjects(data, 'sight');
            sights.addToTab(tab1, greenMarker);
            objectsClass.push(sights);

            //banks
            let banks = new ObjectsBrest(delMarkerViolet);
            banks.addAllObjects(data, 'bank');
            banks.addToTab(tab2, violetMarker);
            objectsClass.push(banks);

            //cafe
            let cafes = new ObjectsBrest(delMarkerPink);
            cafes.addAllObjects(data, 'cafe');
            cafes.addToTab(tab3, pinkMarker);
            objectsClass.push(cafes);

            //shop
            let shops = new ObjectsBrest(delMarkerLightGreen);
            shops.addAllObjects(data, 'shop');
            shops.addToTab(tab4, lightgreenMarker);
            objectsClass.push(shops);

            //event
            let events = new ObjectsBrest(delMarkerPurpul);
            events.addAllObjects(data, 'event');
            events.addToTab(tab5, purpulMarker);
            objectsClass.push(events);

            let objectsFull = [];
            let markersFull = [];
            let containersDivFull = [];
            let containersCheck = [];

            objectsClass.forEach(e => {
                objectsFull = objectsFull.concat(e.objectsArr);
                markersFull = markersFull.concat(e.markersArr);
                containersDivFull = containersDivFull.concat(e.containerDivObjectArr);
                containersCheck = containersCheck.concat(e.containerCheck);
                //Hide Markers
                const deleteCheckBox = e.deleteCheckBox;
                deleteCheckBox.addEventListener('change', () => {
                    markersFull.forEach(marker => marker.getIcon() !== blueMarker ? marker.setOpacity(0) : marker.setOpacity(1));
                    e.markersArr.forEach(el => {
                        //checked
                        if (deleteCheckBox.checked) {
                            let notChecked = delMarkerArr.filter(e => e !== deleteCheckBox);
                            notChecked.forEach(item => item.checked = false);
                            el.getIcon() !== blueMarker ? el.setOpacity(0.7) : el.setOpacity(1);
                        } else {
                            markersFull.forEach((icon, i) => {
                                currentIcon[i] !== blueMarker ? icon.setIcon(currentIcon[i]).setOpacity(0.7).setZIndexOffset(0) : icon.setIcon(currentIcon[i]).setOpacity(1).setZIndexOffset(200)
                            });
                        }
                    })
                })
//    Show Blue Markers
                showMarkerBlue.addEventListener('change', () => {
                    if (showMarkerBlue.checked) {
                        localStorage.setItem('showBlueMarker', true);
                        e.markersArr.forEach((el) =>
                            el.getIcon() === blueMarker ? el.setOpacity(1) : el.setOpacity(0)
                        )
                    } else {
                        localStorage.setItem('showBlueMarker', false);
                        e.markersArr.forEach((el) =>
                            el.getIcon() === blueMarker ? el.setOpacity(1) : el.setOpacity(0.7)
                        )
                    }
                })
            })

            let kindIconStart = [];
            markersFull.forEach(icon => kindIconStart.push(icon.getIcon()))
            let currentIcon = kindIconStart.slice(0);
//        Загрузка страницы
            if (localStorage.getItem('currentUserId')) {
                currentUserId = localStorage.getItem('currentUserId');
                fetch(`http://157.230.108.157:3000/map/user/${localStorage.getItem('currentUserId')}`)
                    .then(response => response.json())
                    .then(currentUser => {
                        userList.textContent = '';
                        let currentUserObjects = currentUser.objects;
                        currentObjectsArr = currentUserObjects;
                        loadLines(currentUserObjects, objectsFull, containersCheck, markersFull, currentIcon, kindIconStart, containersDivFull)
                        changeHeader(currentUser, containersCheck);
                        showBlue(objectsClass, markersFull, currentIcon);
                    })
            }
//Enter/Registration
            registration.addEventListener('click', () => {
                divBlocked.classList.add('blocked');
                createFormRegistration();
                //создание пользователя
                const button = document.getElementById('register');
                const loginReg = document.getElementById('login');
                const emailReg = document.getElementById('email');
                const passwordReg = document.getElementById('password');
                const passwordRepReg = document.getElementById('repeatPassword');
                const formReg = document.getElementById('enterForm');
                button.addEventListener('click', (e) => {
                    e.preventDefault();
                    if (passwordReg.value === passwordRepReg.value && loginReg.value && emailReg.value && emailReg.value.includes('@') && passwordReg.value && passwordReg.value.length >= 8) {
                        fetch('http://157.230.108.157:3000/map/user', {
                            method: 'POST',
                            headers: {'Content-Type': 'application/json'},
                            body: JSON.stringify({
                                login: `${loginReg.value}`,
                                password: `${passwordReg.value}`,
                                email: `${emailReg.value}`
                            })
                        })
                            .then(() => {
                                    close(formReg);
                                    fieldMessage('Учетная запись создана успешно! Можете войти в свой Личный кабинет!')
                                }
                            );
                    } else {
                        if (passwordReg.value !== passwordRepReg.value) {
                            passwordRepReg.nextElementSibling.innerHTML = 'Пароли не совпадают!';
                            passwordRepReg.style.borderColor = 'red';
                            passwordRepReg.nextElementSibling.hidden = false;
                            passwordRepReg.nextElementSibling.style.color = 'red';
                            passwordRepReg.nextElementSibling.style.fontSize = '15px';
                            passwordRepReg.nextElementSibling.style.marginTop = '0';
                            passwordRepReg.nextElementSibling.innerHTML = message;
                        } else {
                            close(formReg);
                            fieldMessage('Не все поля заполнены правильно! Попробуйте еще раз!')
                        }
                    }
                });
            });
            enter.addEventListener('click', () => {
                divBlocked.classList.add('blocked');
                createFormEnter();
                const loginEnter = document.getElementById('loginEnter');
                const passwordEnter = document.getElementById('passwordEnter');
                const buttonEnter = document.getElementById('buttonEnter');
                const formEnter = document.getElementById('formEnter');
                //Вход в приложение
                fetch('http://157.230.108.157:3000/map/user')
                    .then(response => response.json())
                    .then(data => {
                        buttonEnter.addEventListener('click', e => {
                            e.preventDefault();
                            let user = data.find((element) => element.password === passwordEnter.value && element.login === loginEnter.value);
                            if (user) {
                                close(formEnter);
                                location.reload();
                                currentUserId = user.id;
                                localStorage.setItem('currentUserId', `${currentUserId}`);
                                changeHeader(user, containersCheck);
                                let objectsUser = user.objects;
                                currentObjectsArr = objectsUser;
                                loadLines(objectsUser, objectsFull, containersCheck, markersFull, currentIcon, kindIconStart, containersDivFull);
                                showBlue(objectsClass, markersFull, currentIcon);
                            } else {
                                close(formEnter);
                                fieldMessage('Логин или пароль введены неверно! Попробуйте еще раз!')
                            }
                        })
                    })
            })
//свернуть левое поле
            const exit = document.getElementById('exit');
            exit.classList.add('exit');
            const list = document.getElementById('list');
            let mainField = document.querySelector('.mainField');
            const list1 = document.createElement('div');
            const icon = document.createElement('img');
            icon.src = 'image/icon/panel1.png';
            icon.classList.add('icon');

            list1.classList.add('list1');
            list1.style.cursor = 'pointer';
            list1.appendChild(icon);
            const chooseMore = ['C', 'h', 'o', 'o', 's', 'e', '-', 'm', 'o', 'r', 'e'];
            chooseMore.forEach(el => {
                let divEl = document.createElement('div');
                divEl.textContent = el;
                divEl.classList.add('choose');
                list1.appendChild(divEl)
            });
            exit.addEventListener('click', () => {
                mainField.replaceChild(list1, list);
                downField.classList.add('left')
                map.setView(new L.LatLng(52.08511997152023, 23.666023195542415), 14);
            });
            list1.addEventListener('click', () => {
                mainField.replaceChild(list, list1);
                downField.classList.remove('left');
                map.setView(new L.LatLng(52.08486298060644, 23.683443581823557), 14);
            });

//Welcome to Brest
            const downField = document.querySelector('.visualObject');
            divDownField.textContent = 'Welcome to Brest';
            downField.appendChild(divDownField);
            divDownField.classList.add('welcome');

//Tabs
            let tab = function () {
                let tabNav = document.querySelectorAll('.tabs-nav_item');
                let tabContent = document.querySelectorAll('.tab');
                let tabName;
                tabNav.forEach(e => {
                    e.addEventListener('click', () => {
                        tabNav.forEach(el => el.classList.remove('is_active'));
                        e.classList.add('is_active');
                        tabName = e.getAttribute('data-tab-name');
                        selectTabContent(tabName);

                        function selectTabContent(tabName) {
                            tabContent.forEach(item => {
                                item.classList.contains(tabName) ? item.classList.add('is_active') : item.classList.remove('is_active');
                            })
                        }
                    })
                });
            };
            tab();

//Check
            containersCheck.forEach((inputCheck, i) => {
                if (localStorage.getItem('currentUserId') !== "") {
                    inputCheck.addEventListener('change', (e) => {
                        if (inputCheck.checked) {
                            markersFull[i].setIcon(blueMarker).setZIndexOffset(200);
                            currentIcon[i] = markersFull[i].getIcon();
                            objectsClass.forEach(el => {
                                if (el.deleteCheckBox.checked === true) {
                                    markersFull.forEach(marker => marker.getIcon() !== blueMarker ? marker.setOpacity(0) : marker.setOpacity(1));
                                    el.markersArr.forEach((icon) => {
                                        let index = markersFull.indexOf(markersFull.find(element => element === icon));
                                        currentIcon[index] !== blueMarker ? icon.setIcon(currentIcon[index]).setOpacity(0.7).setZIndexOffset(0) : icon.setIcon(currentIcon[index]).setOpacity(1).setZIndexOffset(200)
                                    });
                                    markersFull[i].setIcon(redMarker).setOpacity(1).setZIndexOffset(200);
                                } else {
                                    markersFull.forEach((icon, i) => icon.setIcon(currentIcon[i]).setOpacity(0.7).setZIndexOffset(0));
                                    markersFull[i].setIcon(redMarker).setOpacity(1);
                                }
                            });
                            fetch('http://157.230.108.157:3000/map/object', {
                                    method: 'POST',
                                    headers: {'Content-Type': 'application/json'},
                                    body: JSON.stringify({
                                        "nameMark": objectsFull[i].nameMark,
                                        "latitude": objectsFull[i].latitude,
                                        "longitude": objectsFull[i].longitude,
                                        "address": objectsFull[i].address,
                                        "time": objectsFull[i].time,
                                        "website": objectsFull[i].website,
                                        "imageURL": objectsFull[i].imageURL,
                                        "userId": +currentUserId
                                    })
                                }
                            )
                                .then(() => {
                                    fetch(`http://157.230.108.157:3000/map/object?userId=${currentUserId}`)
                                        .then(response => response.json())
                                        .then(data => {
                                            userList.textContent = '';
                                            currentObjectsArr = data;
                                            loadLines(data, objectsFull, containersCheck, markersFull, currentIcon, kindIconStart, containersDivFull);
                                            showBlue(objectsClass, markersFull, currentIcon);
                                        })
                                })
                        } else {
                            currentIcon[i] = kindIconStart[i];
                            objectsClass.forEach(el => {
                                if (el.deleteCheckBox.checked === true) {
                                    markersFull.forEach(marker => marker.getIcon() !== blueMarker ? marker.setOpacity(0) : marker.setOpacity(1));
                                    el.markersArr.forEach((icon) => {
                                        let index = markersFull.indexOf(markersFull.find(element => element === icon));
                                        currentIcon[index] !== blueMarker ? icon.setIcon(currentIcon[index]).setOpacity(0.7).setZIndexOffset(0) : icon.setIcon(currentIcon[index]).setOpacity(1).setZIndexOffset(200)
                                    });
                                    markersFull[i].setIcon(redMarker).setOpacity(1).setZIndexOffset(200);
                                } else {
                                    markersFull.forEach((icon, i) => icon.setIcon(currentIcon[i]).setOpacity(0.7).setZIndexOffset(0));
                                    markersFull[i].setIcon(redMarker).setOpacity(1);
                                }
                            });
                            fetch(`http://157.230.108.157:3000/map/object?userId=${currentUserId}`)
                                .then(response => response.json())
                                .then(data => {
                                    let chooseObject = data.find(element => element.nameMark === `${objectsFull[i].nameMark}`);
                                    let chooseElementId = chooseObject.id;
                                    fetch(`http://157.230.108.157:3000/map/object/${chooseElementId}`,
                                        {method: 'DELETE'})
                                        .then(() => {
                                            markersFull[i].setIcon(kindIconStart[i]);
                                            fetch(`http://157.230.108.157:3000/map/object?userId=${currentUserId}`)
                                                .then(response => response.json())
                                                .then(data => {
                                                    userList.textContent = '';
                                                    currentObjectsArr = data;
                                                    loadLines(data, objectsFull, containersCheck, markersFull, currentIcon, kindIconStart, containersDivFull);
                                                    showBlue(objectsClass, markersFull, currentIcon);
                                                })
                                        })
                                })
                        }
                    })
                } else {
                    inputCheck.addEventListener('click', box => {
                        box.preventDefault();
                        fieldMessage('Для каких-либо действий необходима авторизоваться или зарегистрироваться!')
                    })
                }
            })


//FOCUS LeftSide
            containersDivFull.forEach((div, i) => {
                div.addEventListener('click', () => {
                    showMarkerBlue.checked = false;
                    containersDivFull.forEach(item => item.classList.remove('chooseColor'));
                    div.classList.add('chooseColor');
                    addInfoBox(i, objectsFull);
                    objectsClass.forEach(el => {
                        if (el.containerDivObjectArr.some(e => e === div)) {
                            if (el.deleteCheckBox.checked === true) {
                                markersFull.forEach(marker => marker.getIcon() !== blueMarker ? marker.setOpacity(0) : marker.setOpacity(1));
                                el.markersArr.forEach((icon) => {
                                    let index = markersFull.indexOf(markersFull.find(element => element === icon));
                                    currentIcon[index] !== blueMarker ? icon.setIcon(currentIcon[index]).setOpacity(0.7).setZIndexOffset(0) : icon.setIcon(currentIcon[index]).setOpacity(1).setZIndexOffset(200)
                                });
                                markersFull[i].setIcon(redMarker).setOpacity(1).setZIndexOffset(200);
                            } else {
                                markersFull.forEach((icon, i) => icon.setIcon(currentIcon[i]).setOpacity(0.7).setZIndexOffset(0));
                                markersFull[i].setIcon(redMarker).setOpacity(1);
                                delMarkerArr.find(item => item.checked).checked = false;
                            }
                        }
                    })
                })
            });
            markersFull.forEach((mark, i) => {
                mark.on('click', () => {
                    objectsClass.forEach(el => {
                        if (el.markersArr.some(e => e === mark)) {
                            if (el.deleteCheckBox.checked === true) {
                                markersFull.forEach((icon, i) => icon.setIcon(currentIcon[i]).setOpacity(0).setZIndexOffset(0));
                                el.markersArr.forEach((icon) => {
                                    let index = markersFull.indexOf(markersFull.find(element => element === icon));
                                    currentIcon[index] !== blueMarker ? icon.setIcon(currentIcon[index]).setOpacity(0.7).setZIndexOffset(0) : icon.setIcon(currentIcon[index]).setOpacity(1).setZIndexOffset(200)
                                })
                                mark.setIcon(redMarker).setOpacity(1).setZIndexOffset(200);
                            } else if (showMarkerBlue.checked === true) {
                                console.log('true');
                                markersFull.forEach((icon, i) => icon.setIcon(currentIcon[i]).setOpacity(0).setZIndexOffset(0));
                                el.markersArr.forEach((icon) => {
                                    let index = markersFull.indexOf(markersFull.find(element => element === icon));
                                    currentIcon[index] !== blueMarker ? icon.setIcon(currentIcon[index]).setOpacity(0).setZIndexOffset(0) : icon.setIcon(currentIcon[index]).setOpacity(1).setZIndexOffset(200)
                                });
                                delMarkerArr.find(item => item.checked).checked = false;
                                mark.setIcon(redMarker).setOpacity(1).setZIndexOffset(200);
                                showMarkerBlue.checked = true;
                            } else {
                                markersFull.forEach((icon, i) => icon.setIcon(currentIcon[i]).setOpacity(0.7).setZIndexOffset(0));
                                mark.setIcon(redMarker).setOpacity(1).setZIndexOffset(200);
                            }
                        }
                    })
                    containersDivFull.forEach(item => item.classList.remove('chooseColor'));
                    containersDivFull[i].classList.add('chooseColor');
                    containersDivFull[i].scrollIntoView();
                });
                mark.on('dblclick', () => {
                    addInfoBox(i, objectsFull)
                })
            });


//    Добавить свой объект
            const buttonAdd = document.createElement('button');
            buttonAdd.classList.add('buttonAdd');
            buttonAdd.textContent = '+ Add';
            mainUserList.appendChild(buttonAdd);
            let form = createFormAdd();
            form.hidden = true;
            let addLat = document.getElementById('latitudeEl');
            let addLng = document.getElementById('longiudeEl');
            let addNameMark = document.getElementById('nameMarkAdd');
            let safeAdd = document.getElementById('safeAdd');
            let currentLatlng;
            if (localStorage.getItem('currentUserId')) {
                buttonAdd.addEventListener('click', (event) => {
                    event.preventDefault();
                    form.hidden = false;
                    map.on("click", (event) => {
                        currentLatlng = event.latlng;
                        addLat.value = currentLatlng.lat;
                        addLng.value = currentLatlng.lng;
                    })
                })
                safeAdd.addEventListener('click', (e) => {
                    e.preventDefault();
                    // close(formAdd);
                    fetch('http://157.230.108.157:3000/map/object', {
                            method: 'POST',
                            headers: {'Content-Type': 'application/json'},
                            body: JSON.stringify({
                                "nameMark": `${addNameMark.value}`,
                                "latitude": +addLat.value,
                                "longitude": +addLng.value,
                                "address": '',
                                "time": '',
                                "website": '',
                                "imageURL": '',
                                "userId": +currentUserId
                            })
                        }
                    )
                        .then(() => {
                            form.hidden = true;
                            addLat.value = null;
                            addLng.value = null;
                            addNameMark.value = null;
                            fetch(`http://157.230.108.157:3000/map/object?userId=${currentUserId}`)
                                .then(response => response.json())
                                .then(data => {
                                    userList.textContent = '';
                                    currentObjectsArr = data;
                                    loadLines(data, objectsFull, containersCheck, markersFull, currentIcon, kindIconStart, containersDivFull);
                                    showBlue(objectsClass, markersFull, currentIcon);
                                })
                        })
                })
            } else {
                buttonAdd.addEventListener('click', box => {
                    box.preventDefault();
                    fieldMessage('Для каких-либо действий необходима авторизоваться или зарегистрироваться!')
                })
            }
//RightSide
            let previousElement = null;
            let previousMarker = null;
            let element = null;
            let currentElement = null;
            let currentMarker = null;
            userList.addEventListener('click', (e) => {
                if (e.target.tagName === 'DIV') {
                    currentElement = e.target;
                    let text = `${currentElement.textContent}`;
                    element = currentObjectsArr.find(item => item.nameMark === text);
                    currentMarker = L.marker([element.latitude, element.longitude], {
                        icon: orangeMarker,
                        opacity: 1,
                        riseOnHover: true,
                        riseOffSet: 250
                    }).bindPopup(createPopupContent(element)).openPopup(true).addTo(map);
                    if (currentElement === previousElement) {
                        currentElement.classList.toggle('changeColor');
                        currentMarker.setOpacity(0).setZIndexOffset(0);
                    } else {
                        currentElement.classList.add('changeColor');
                        previousElement && previousElement.classList.remove('changeColor');
                        previousElement = currentElement;
                        previousMarker && previousMarker.setOpacity(0).setZIndexOffset(0);
                        previousMarker = currentMarker;
                    }
                }
                //delete
                if (e.target.className === 'imgDelete') {
                    let idElement = e.target.dataset.id;
                    fetch(`http://157.230.108.157:3000/map/object/${idElement}`,
                        {method: 'DELETE'})
                        .then(() => {
                            fetch(`http://157.230.108.157:3000/map/object?userId=${currentUserId}`)
                                .then(response => response.json())
                                .then(data => {
                                    userList.textContent = '';
                                    currentObjectsArr = data;
                                    loadLines(data, objectsFull, containersCheck, markersFull, currentIcon, kindIconStart, containersDivFull);
                                    showBlue(objectsClass, markersFull, currentIcon);
                                    objectsFull.forEach((e, i) => {
                                        let searchElement = data.find(element => element.nameMark === e.nameMark);
                                        if (!searchElement) {
                                            containersCheck[i].checked = false;
                                            currentIcon[i] = kindIconStart[i];
                                            markersFull[i].setIcon(kindIconStart[i]).setOpacity(0.7).setZIndexOffset(0);
                                        }
                                    });
                                    ownMarkers.forEach(e => {
                                            let searchMarkerOwnObject = data.find(item => item.longitude === e._latlng.lng);
                                            (!searchMarkerOwnObject) ? e.setOpacity(0) : e.setOpacity(1)
                                        }
                                    )
                                })
                        })
                }
            })


//    route
            const labelRoute = document.createElement('label');
            labelRoute.textContent = 'Show route';
            const buttonRoute = document.createElement('input');
            buttonRoute.type = 'checkbox';
            labelRoute.appendChild(buttonRoute);
            labelRoute.classList.add('buttonRoute');
            mainUserList.appendChild(labelRoute);
            buttonRoute.addEventListener('change', () => {
                currentObjectsArr.forEach(element => {
                    let array = [];
                    array.push(element.latitude, element.longitude);
                    routeElement.push(array);
                });
                routeElement.sort((a, b) => a[1] - b[1]);

                //router
                let route = L.Routing.control({
                    waypoints: routeElement,
                    routeWhileDragging: true,
                    lineOptions: {
                        styles: [{color: 'blue', opacity: 1, weight: 1}]
                    },
                    createMarker: function () {
                        return null;
                    },
                    show: false,
                    router: L.Routing.mapbox('pk.eyJ1Ijoib2xsYXBvdGFwY2h1ayIsImEiOiJja2wxdXZvcjMwMXl4MnByMXRtbnowYWdzIn0.aFpsmhcdVOodC12uaLe5fA')
                });
                if (buttonRoute.checked) {
                    route.addTo(map);
                } else {
                    location.reload()
                }
            })
        }
    )


//Функции создания элементов формы
function elementForm(headerElem, typeElem, nameElem, idElem) {
    const label = document.createElement('label');
    const divName = document.createElement('div');
    divName.textContent = headerElem;
    const input = document.createElement('input');
    input.type = typeElem;
    input.name = nameElem;
    input.id = idElem;
    const divError = document.createElement('div');
    divError.textContent = '';
    label.appendChild(divName);
    label.appendChild(input);
    label.appendChild(divError);
    //    Validation
    input.addEventListener('blur', e => {
        validation(e, divError, input)
    })
    input.addEventListener('focus', resetError)
    return label
}

//Validation
const addErrorToField = (e, message, divError) => {
    e.target.style.borderColor = 'red';
    divError.hidden = false;
    divError.style.color = 'red';
    divError.style.fontSize = '15px';
    divError.style.marginTop = '0';
    divError.innerHTML = message;
}

const resetError = e => {
    e.target.style.borderColor = 'forestgreen';
    e.target.nextElementSibling.innerHTML = ''
}
const validation = (e, divError, input) => {
    if (input.type === 'text' && !e.target.value) {
        addErrorToField(e, 'Поле обязательно для ввода!', divError)
    }
    if (input.type === 'password' && (!e.target.value || e.target.value.length < 8)) {
        addErrorToField(e, 'Пароль должен содержать не менее 8 символов!', divError)
    }
    if (input.type === 'email' && (!e.target.value || !e.target.value.includes('@'))) {
        addErrorToField(e, 'Введите корректный электронный адрес!', divError)
    }
    if (input.type === 'email' && (!e.target.value || !e.target.value.includes('@'))) {
        addErrorToField(e, 'Введите корректный электронный адрес!', divError)
    }
}

function buttonForm(textElem) {
    const button = document.createElement('button');
    button.textContent = textElem;
    return button
}

function headerForm(textForm) {
    const formHeader = document.createElement('div');
    formHeader.textContent = textForm;
    return formHeader
}

function close(element) {
    divBlocked.classList.remove('blocked');
    element.style.display = 'none'
}

function buttonX(element) {
    const buttonX = document.createElement('div');
    buttonX.textContent = 'X';
    buttonX.classList.add('buttonX');
    element.appendChild(buttonX);
    buttonX.addEventListener('click', (e) => {
        e.preventDefault();
        close(element)
    })
}

//всплывающее сообщение
function fieldMessage(text) {
    divBlocked.classList.add('blocked');
    const elementMessage = document.createElement('div');
    elementMessage.textContent = text;
    const closeBut = document.createElement('button');
    closeBut.textContent = 'Close';
    closeBut.classList.add('button');
    elementMessage.appendChild(closeBut);
    const message = document.body.appendChild(elementMessage);
    message.classList.add('successReg');
    closeBut.addEventListener('click', (e) => {
        e.preventDefault();
        close(message)
    })
}

//Создание формы регистрации
function createFormRegistration() {
    const form = document.createElement('form');
    form.name = 'registration';
    const formHeader = headerForm('Registration');
    const labelLogin = elementForm('Login', 'text', 'Login', 'login');
    const labelEmail = elementForm('Email', 'email', 'Email', 'email');
    const labelPassword = elementForm('Password', 'password', 'Password', 'password');
    const labelRepeatPassword = elementForm('Repeat Password', 'password', 'RepeatPassword', 'repeatPassword');
    const button = buttonForm('Register');
    button.id = 'register';
    button.classList.add('button');
    const button2 = buttonForm('You already have Account!')
    button2.classList.add('button2');
    form.appendChild(formHeader);
    form.appendChild(labelLogin);
    form.appendChild(labelEmail);
    form.appendChild(labelPassword);
    form.appendChild(labelRepeatPassword);
    form.appendChild(button);
    form.appendChild(button2);
    const formEnter = document.body.appendChild(form);
    formEnter.id = 'enterForm';
    formEnter.classList.add('formEnter');
    buttonX(form);
    button2.addEventListener('click', (e) => {
        e.preventDefault();
        form.remove();
        createFormEnter()
    })
}


//создание формы входа в Личный кабинет
function createFormEnter() {
    const form = document.createElement('form');
    const formHeader = headerForm('Enter to your account');
    const labelLogin = elementForm('Login', 'text', 'Login', 'loginEnter');
    const labelPassword = elementForm('Password', 'password', 'Password', 'passwordEnter');
    const button = buttonForm('Enter');
    button.classList.add('button');
    button.id = 'buttonEnter';
    const button2 = buttonForm('Registration');
    button2.classList.toggle('button2');
    form.appendChild(formHeader);
    form.appendChild(labelLogin);
    form.appendChild(labelPassword);
    form.appendChild(button);
    form.appendChild(button2);
    const formEnter = document.body.appendChild(form);
    formEnter.classList.add('formEnter');
    formEnter.id = 'formEnter';
    buttonX(form);

    button2.addEventListener('click', (e) => {
        e.preventDefault();
        form.remove();
        createFormRegistration()
    })
}

//создание формы добавить новый элемент
function createFormAdd() {
    const form = document.createElement('form');
    const headerAdd = headerForm(`Нажмите правой кнопкой мыши 
                точку на карте либо введите координаты`);
    const labelLat = elementForm('Широта', 'text', 'latitude', 'latitudeEl');
    const labelLon = elementForm('Долгота', 'text', 'longitude', 'longiudeEl');
    const labelnameMark = elementForm('Введите наименование объекта', 'text', 'nameAddObject', 'nameMarkAdd');
    const safeAdd = buttonForm('Add');
    safeAdd.classList.add('button');
    safeAdd.id = 'safeAdd';
    form.appendChild(headerAdd);
    form.appendChild(labelLat);
    form.appendChild(labelLon);
    form.appendChild(labelnameMark);
    form.appendChild(safeAdd);
    form.classList.add('formAdd');
    const formAdd = document.body.appendChild(form);
    buttonX(formAdd);
    formAdd.id = 'formAdd';
    return formAdd
}

//Функции создания элемента
function createDiv(nameField, object, main) {
    let container = document.createElement('div');
    container.textContent = `${nameField} ${object}`;
    main.appendChild(container);
    return main
}

function addInfoBox(i, objectsFull) {
    divDownField.textContent = '';
    divDownField.classList.add('flexF');
    const imgObject = document.createElement('div');
    const fotoObject = document.createElement('img');
    fotoObject.src = `${objectsFull[i]['imageURL']}`;
    fotoObject.alt = `${objectsFull[i]['nameMark']}`;
    fotoObject.classList.add('imgFotoObject');
    imgObject.appendChild(fotoObject);
    imgObject.classList.add('imgObject');
    divDownField.appendChild(imgObject);
    const infoObject = document.createElement('div');
    infoObject.classList.add('infoObject');
    createDiv('', objectsFull[i]['nameMark'], infoObject);
    createDiv('Адрес:', objectsFull[i]['address'], infoObject);
    createDiv('Время работы:', objectsFull[i]['time'], infoObject);
    let website = document.createElement('div');
    let a = document.createElement('a');
    a.href = `${objectsFull[i]['website']}`;
    a.target = 'target';
    a.textContent = `${objectsFull[i]['website']}`;
    website.textContent = `Сайт:`;
    website.appendChild(a);
    infoObject.appendChild(website);
    divDownField.appendChild(infoObject)
}

function createPopupContent(e) {
    let popupContent = document.createElement('div');
    popupContent.textContent = `${e.nameMark}`;
    let imagepopup = document.createElement('img');
    imagepopup.src = `${e.imageURL}`;
    imagepopup.style.width = '100%';
    popupContent.appendChild(imagepopup);
    popupContent.classList.add('popup');
    return popupContent
}

//CLASS CreateObjects
class ObjectsBrest {
    constructor(deleteCheckBox, objectsArr = []) {
        if (!Array.isArray(objectsArr)) {
            console.error('Необходим массив!');
            this.objectsArr = [];
            return
        }
        this.objectsArr = objectsArr;
        this.markersArr = [];
        this.containerDivObjectArr = [];
        this.containerCheck = [];
        this.deleteCheckBox = deleteCheckBox
    }

    addAllObjects(data, type) {
        if (Array.isArray(data[type])) {
            this.objectsArr = this.objectsArr.concat(data[type]);
        } else {
            this.objectsArr.push(data[type])
        }
    }

    addToTab(tab, typeMark) {
        this.objectsArr.forEach(e => {
                let marker = L.marker([e.latitude, e.longitude], {
                    icon: typeMark,
                    opacity: 0.7,
                    riseOnHover: true,
                    riseOffSet: 200
                })
                    .bindPopup(createPopupContent(e))
                    .addTo(map);
                this.markersArr.push(marker);
                let divContainer = document.createElement('div');
                divContainer.classList.add('listName');
                let divEl = document.createElement('div');
                divEl.textContent = `${e.nameMark}`;
                let boxEl = document.createElement('input');
                boxEl.type = 'checkbox';
                divContainer.appendChild(divEl);
                divContainer.appendChild(boxEl);
                divContainer.classList.add('tabElement');
                tab.appendChild(divContainer);
                this.containerDivObjectArr.push(divContainer);
                this.containerCheck.push(boxEl);
            }
        )
    };
}

//Функция создания строчек
function createLines(objectsArr, tab, typeMark, objectsFull, containersCheck, markersFull, currentIcon, kindIconStart, containersDivFull) {
    objectsArr.forEach(e => {
        let divContainer = document.createElement('div');
        divContainer.classList.add('listName');
        let divEl = document.createElement('div');
        divEl.textContent = `${e.nameMark}`;
        let imgDelete = document.createElement('img');
        imgDelete.src = 'image/icon/delete.png';
        imgDelete.classList.add('imgDelete');
        imgDelete.dataset.id = e.id;
        divContainer.appendChild(divEl);
        divContainer.appendChild(imgDelete);
        divContainer.classList.add('tabElement');
        tab.appendChild(divContainer);
        let searchElement = objectsFull.find(element => element.nameMark === e.nameMark);
        let index = objectsFull.indexOf(searchElement);
        containersCheck[index].checked = true;
        if (containersCheck[index].checked) {
            markersFull[index].setIcon(blueMarker).setOpacity(1).setZIndexOffset(200);
            currentIcon[index] = markersFull[index].getIcon();
            chosenMarkers.push(markersFull[index]);
        } else {
            currentIcon[index] = kindIconStart[index]
        }
        chosenContainers.push(containersDivFull[index])
    })
}

function createLinesOwn(objectsArr, tab, typeMark) {
    objectsArr.forEach(e => {
        let divContainer = document.createElement('div');
        divContainer.classList.add('listName');
        let divEl = document.createElement('div');
        divEl.textContent = `${e.nameMark} (Created object)`;
        let imgDelete = document.createElement('img');
        imgDelete.src = 'image/icon/delete.png';
        imgDelete.classList.add('imgDelete');
        imgDelete.dataset.id = e.id;
        divContainer.appendChild(divEl);
        divContainer.appendChild(imgDelete);
        divContainer.classList.add('tabElement');
        tab.appendChild(divContainer);
        let markerOwn = L.marker([e.latitude, e.longitude], {
            icon: typeMark,
            opacity: 1,
            riseOnHover: true,
            riseOffSet: 200
        })
            .bindPopup(e.nameMark)
            .addTo(map);
        ownMarkers.push(markerOwn);
        chosenMarkers.push(markerOwn);
        chosenContainers.push(divContainer)
    })

}

function loadLines(objectsArr, objectsFull, containersCheck, markersFull, currentIcon, kindIconStart, containersDivFull) {
    let permObjects = objectsArr.filter(e => objectsFull.some(element => element.nameMark === e.nameMark));
    let ownObjects = objectsArr.filter(e => objectsFull.every(element => element.nameMark !== e.nameMark));
    createLines(permObjects, userList, blueMarker, objectsFull, containersCheck, markersFull, currentIcon, kindIconStart, containersDivFull);
    createLinesOwn(ownObjects, userList, bluegreenMarker);
}

//функция изменения header

function changeHeader(user, containersCheck) {
    enter.style.display = 'none';
    registration.style.display = 'none';
    const userDiv = document.createElement('div');
    userDiv.textContent = `User: ${user.login}`;
    userDiv.classList.add('leftBorderStyle');
    enterFormDiv.appendChild(userDiv);
    const exit = document.createElement('div');
    exit.textContent = 'Exit';
    exit.id = 'exit';
    enterFormDiv.appendChild(exit);
    exit.addEventListener('click', () => {
        localStorage.setItem('currentUserId', '');
        exit.style.display = 'none';
        userDiv.style.display = 'none';
        enter.style.display = 'block';
        registration.style.display = 'block';
        location.reload()
    })
}

//функция проверки showBlue
function showBlue(objectsClass, markersFull, currentIcon) {
    objectsClass.forEach(e => {
            if (localStorage.getItem('showBlueMarker') === 'true') {
                showMarkerBlue.checked = true;
                e.markersArr.forEach((el) =>
                    el.getIcon() === blueMarker ? el.setOpacity(1) : el.setOpacity(0)
                )
            } else {
                showMarkerBlue.checked = false;
                e.markersArr.forEach((el) => {
                    if (e.deleteCheckBox.checked === true) {
                        markersFull.forEach(marker => marker.getIcon() !== blueMarker ? marker.setOpacity(0) : marker.setOpacity(1));
                        e.markersArr.forEach((icon) => {
                            let index = markersFull.indexOf(markersFull.find(element => element === icon));
                            currentIcon[index] !== blueMarker ? icon.setIcon(currentIcon[index]).setOpacity(0.7).setZIndexOffset(0) : icon.setIcon(currentIcon[index]).setOpacity(1).setZIndexOffset(200)
                        });
                    } else {
                        markersFull.forEach((el) =>
                            el.getIcon() === blueMarker ? el.setOpacity(1) : el.setOpacity(0.7)
                        )

                    }
                })
            }
        }
    )
}

// fetch(`http://157.230.108.157:3000/map/object/117`,
//     {method: 'DELETE'})