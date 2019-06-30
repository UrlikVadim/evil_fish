
var CURRENT_WINDOW = $('#toolbar').children()[0];
var SELECTED_CATEG = $('.categ > div')[0].firstElementChild;
var SELECTED_CATEG_VEGAN = $('.categ > div')[1].firstElementChild;

window.native_alert = window.alert;
window.alert = function(msg, error){
    msg = msg ? msg : 'Сервер не отвечает';
    if(error){
        document.getElementById("msg_alert").innerHTML = '<b>Ошибка</b>' + msg.toString();
    }else{
        document.getElementById("msg_alert").innerHTML = msg.toString();
    }
    $('#disable-win').css('display', 'block');
    $('.message-box').animate(
    {
        top: '25%'
    },
    300,
    function(){

    });
}
$('#message-box-close').click(function(e){
    $('.message-box').animate(
        {
            top: '-55%'
        },
        200,
        function(){
            $('#disable-win').css('display', 'none');
        });
});


function fetchProduct(id, vegan){
    var prod_view = document.getElementsByClassName('product-view');
    prod_view = (vegan) ? prod_view[1] : prod_view[0];
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/getproduct/'+id, true);
    xhr.onreadystatechange = function() {
        if (this.readyState != 4){
            return;
        }
        if (xhr.status == 200) {
            var products = new Products(this.responseText);
            products.custom_sorted(4);
            products.render(prod_view);
//            prod_view.innerHTML = this.responseText;
        } else {
            prod_view.innerHTML = '';
            alert(this.responseText, true);
        }

    }
    prod_view.innerHTML = '<div class="lds-ring"><div></div><div></div><div></div><div></div></div>';
    xhr.send();
}

function Products(string_data){
    var res = JSON.parse(string_data);
    for(key in res){
        this[key] = res[key];
    }
    for(var i = 0; i < this.data.length; i++){
        if(this.data[i].typecomp == 'st'){
            this.data[i].sort_value = 1;
        }
        else{
            this.data[i].sort_value = 2;
        }
        this.data[i].price = this.data[i].price.split('\n');
    }
}
Products.prototype = {
    custom_sorted: function (MAX_EL){
        function ev(num){
            return num.sort_value > elem.sort_value;
        }
        var old_arr = this.data.slice(0, this.data.length).reverse();
        var out = [];
        var inter_arr = [];
        var k = 0;
        var i = 0;
        var elem = null;
        while(old_arr.length || inter_arr.length){
            i++;
            if(i > 1000){break;}
            while(inter_arr.length){
                if(k + inter_arr[inter_arr.length - 1].sort_value <= MAX_EL){
                    elem = inter_arr.pop();
                    out.push(elem);
                    k += elem.sort_value;
                    k = k == MAX_EL ? 0: k;
                }
                else{
                    break;
                }
            }
            if(old_arr.length){
                elem = old_arr.pop();
                if(old_arr.every(ev)){
                    old_arr.unshift(elem);
                    elem = old_arr.pop();
                }
                if(k + elem.sort_value <= MAX_EL){
                    out.push(elem);
                    k += elem.sort_value;
                    k = k == MAX_EL ? 0: k;
                }
                else{
                    inter_arr.push(elem);
                }
            }
        }
        this.data = out;
    },
    render: function(view){
        if(this.data.length){
            view.innerHTML = "";
            for(var i = 0; i < this.data.length; i++){
                if(this.data[i].typecomp == 'st'){
                    view.appendChild(this.standart_layout(i));
                    continue;
                }
                if(this.data[i].typecomp == 'd1'){
                    view.appendChild(this.dual_layout(i));
                    continue;
                }
            }
        }
        else{
            view.innerHTML = '<div class="nono-product"><div class="message-box-inner">В данной категории нет продуктов</div></div>';
        }
    },
    standart_layout: function(i){
        var el = document.createElement('div');
        el.style.setProperty('animation-delay', (i*100)+'ms', "important");
        el.className = 'standart_layout';
        var con_s = 'display: -webkit-flex;display: flex; justify-content:space-between; align-items: center;';
        var el_s = 'vertical-align: middle;';
        var HTML = '<div><div>';
        if (this.data[i].imageurl != ''){
            HTML += '<b style="font-size:3vh;position: absolute;top:0%;left:0;">'+this.data[i].title+'</b>';
            HTML +=  '<br><img width="100%" src="static/images/'+this.data[i].imageurl+'"><br>';
            HTML += this.data[i].description;
            HTML += '<hr>';
            for(var j =0; j < this.data[i].price.length; j++){
                var price = this.data[i].price[j].split(' ');
                var pr = price.pop()
                HTML += '<div style="'+con_s+'"><span style="'+el_s+'">'+price.join(' ')+'</span><span style="color:red;'+el_s+'">'+pr+'</span></div>';
            }
        }
        else{
            HTML += '<b style="font-size:3vh;">'+this.data[i].title+'</b><br>';
            HTML += this.data[i].description;
            HTML += '<hr>';
            for(var j =0; j < this.data[i].price.length; j++){
                var price = this.data[i].price[j].split(' ');
                var pr = price.pop()
                HTML += '<div style="'+con_s+'"><span style="'+el_s+'">'+price.join(' ')+'</span><span style="color:red;'+el_s+'">'+pr+'</span></div>';
            }
        }
        HTML += '</div></div>';
        el.innerHTML = HTML;
        return el;
    },
    dual_layout: function(i){
        var el = document.createElement('div');
        el.style.setProperty('animation-delay', (i*100)+'ms', "important");
        el.className = 'dual_layout';
        var HTML  = '<div><div>';
        HTML += this.data[i].title;
        HTML += this.data[i].imageurl != '' ? '<br><img width="100%" src="static/images/'+this.data[i].imageurl+'"><br>': '<br>';
        HTML += this.data[i].price.join('<br>');
        HTML += '<hr>';
        HTML += this.data[i].description;
        HTML += '</div></div>';
        el.innerHTML = HTML;
        return el;
    }
};


window.onload = function(){
    // обработчик выбора вкладок
    $('#toolbar').click(function(e){
        if(e.target.classList.contains("menu-button") && CURRENT_WINDOW != e.target){
            CURRENT_WINDOW.classList.remove('menu-button-clicked');
            e.target.classList.add('menu-button-clicked');
            CURRENT_WINDOW = e.target;
            $('.content-page, .product-view').css('overflow', 'hidden');
            $('#slide-block').animate(
            {
                left: e.target.dataset.offset
            },
            400,
            function(){
                $('.content-page, .product-view').css('overflow', 'auto');
            }
            );
        }
    });
    // обработчик выбора категорий
    $('.categ > div').click(function(e){
        if(e.target.classList.contains("categ-item")){
            var sel_el = 1*this.dataset.vegan ? SELECTED_CATEG_VEGAN : SELECTED_CATEG;
            sel_el.classList.remove('categ-item-clicked');
            e.target.classList.add('categ-item-clicked');
            if(1*this.dataset.vegan){
                SELECTED_CATEG_VEGAN = e.target;
            }
            else{
                SELECTED_CATEG = e.target;
            }
            fetchProduct(e.target.dataset.id, 1*this.dataset.vegan);
        }

    });
    $(SELECTED_CATEG).click();
    $(SELECTED_CATEG_VEGAN).click();

}
