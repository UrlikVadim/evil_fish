
var CURRENT_WINDOW = $('#toolbar').children()[0];
var SELECTED_CATEG = $('.categ > div')[0].firstElementChild;
var SELECTED_CATEG_VEGAN = $('.categ > div')[1].firstElementChild;

function orientation(){
    return window.innerHeight > window.innerWidth;
}

window.native_alert = window.alert;
window.alert = function(msg, error){
    msg = msg ? msg : 'Сервер не отвечает';
    if(error){
        document.getElementById("msg_alert").innerHTML = '<b style="color:red;text-shadow: 0 3px 3px rgba(0, 0, 0, 0.8);">Ошибка</b>' + msg.toString();
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
    var categ = (vegan) ? SELECTED_CATEG_VEGAN.innerHTML : SELECTED_CATEG.innerHTML;
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/getproduct/'+id, true);
    xhr.onreadystatechange = function() {
        if (this.readyState != 4){
            return;
        }
        if (xhr.status == 200) {
            if(orientation()){
                prod_view.innerHTML = '<div style="font-size:3vh;font-weight:600;color:#dddddd;text-align:center;margin:2%;">'+categ+'</div>';
            }
            else{
                prod_view.innerHTML = '';
            }
            var products = new Products(this.responseText);
            if(orientation()) {
                products.custom_sorted(2);
            }
            else{
                products.custom_sorted(4);
            }
            products.render(prod_view);
//            prod_view.innerHTML = this.responseText;
        } else {
            prod_view.innerHTML = '';
            alert(this.responseText, true);
        }

    }
    if(orientation()){
        prod_view.innerHTML = '<div style="font-size:3vh;font-weight:600;color:#dddddd;text-align:center;margin:2%;">'+categ+'</div><div class="lds-ring"><div></div><div></div><div></div><div></div></div>';
    }
    else{
        prod_view.innerHTML = '<div class="lds-ring"><div></div><div></div><div></div><div></div></div>';
    }
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
            for(var i = 0; i < this.data.length; i++){
                if(this.data[i].typecomp == 'st'){
                    view.appendChild(this.standart_layout(i));
                    continue;
                }
                if(this.data[i].typecomp == 'd1'){
                    view.appendChild(this.dual_layout(i));
                    continue;
                }
                if(this.data[i].typecomp == 'd2'){
                    view.appendChild(this.dual_layout2(i));
                    continue;
                }
            }
        }
        else{
            view.innerHTML = '<div class="nono-product"><div class="message-box-inner">Категория пуста</div></div>';
        }
    },
    get_head_s: function(){
        var head_s = 'text-shadow: 0 3px 3px rgba(0, 0, 0, 0.8);';
        head_s += 'font-size:3vh;';
        if(orientation()) {
            head_s += 'font-size:2vh';
        }
        return head_s;
    },
    standart_layout: function(i){
        var el = document.createElement('div');
        el.style.setProperty('animation-delay', (i*100)+'ms', "important");
        el.className = 'standart_layout';
        var head_s = this.get_head_s();
        var con_s = 'display: -webkit-flex;display: flex; justify-content:space-between; align-items: center;margin: 2% 0;';
        var el_s = 'vertical-align: middle;';
        var HTML = '<div><div>';
        if (this.data[i].imageurl != ''){
            HTML += '<b style="'+head_s+';position: absolute;top:0%;left:0;">'+this.data[i].title+'</b>';
            HTML +=  '<br><img width="100%" src="static/images/'+this.data[i].imageurl+'"><br>';
            HTML += this.data[i].description;
            HTML += '<div style="margin: 2% 0;border-top: 1px solid #999999"></div>';
            for(var j =0; j < this.data[i].price.length; j++){
                var price = this.data[i].price[j].split(' ');
                var pr = price.pop()
                HTML += '<div style="'+con_s+'"><span style="'+el_s+'">'+price.join(' ')+'</span><span style="text-shadow: 1px 2px 2px rgba(0, 0, 0, 0.8);color:red;'+el_s+'">'+pr+'</span></div>';
            }
        }
        else{
            HTML += '<b style="'+head_s+'">'+this.data[i].title+'</b><br>';
            HTML += this.data[i].description;
            HTML += '<div style="margin: 2% 0;border-top: 1px solid #999999"></div>';
            for(var j =0; j < this.data[i].price.length; j++){
                var price = this.data[i].price[j].split(' ');
                var pr = price.pop()
                HTML += '<div style="'+con_s+'"><span style="'+el_s+'">'+price.join(' ')+'</span><span style="text-shadow: 1px 2px 2px rgba(0, 0, 0, 0.8);color:red;'+el_s+'">'+pr+'</span></div>';
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
        var head_s = this.get_head_s();
        var con_s = 'display: -webkit-flex;display: flex; justify-content:space-between; align-items: center;margin: 2% 0;';
        var el_s = 'vertical-align: middle;';
        var HTML  = '<div><div>';
        if(this.data[i].imageurl != ''){
            HTML += '<b style="'+head_s+';position: absolute;top:0%;left:0;">'+this.data[i].title+'</b>';
        }
        else{
            HTML += '<b style="'+head_s+';">'+this.data[i].title+'</b>';
        }
        HTML += this.data[i].imageurl != '' ? '<div style="margin:auto;width:60%"><img width="100%" src="static/images/'+this.data[i].imageurl+'"></div>': '<br>';
        HTML += '<div style="display:inline-block;width:45%;height:100%;vertical-align:top;padding:0 2%;border-right: 1px solid #999999;border-top: 1px solid #999999">';
        for(var j =0; j < this.data[i].price.length; j++){
            var price = this.data[i].price[j].split(' ');
            var pr = price.pop()
            HTML += '<div style="'+con_s+'"><span style="'+el_s+'">'+price.join(' ')+'</span><span style="text-shadow: 1px 2px 2px rgba(0, 0, 0, 0.8);color:red;'+el_s+'">'+pr+'</span></div>';
        }
        HTML += '</div><div style="display:inline-block;width:46%;vertical-align:top;padding:0.5% 2%;border-top: 1px solid #999999">';
        HTML += this.data[i].description;
        HTML += '</div></div></div>';
        el.innerHTML = HTML;
        return el;
    },
    dual_layout2: function(i){
        var el = document.createElement('div');
        el.style.setProperty('animation-delay', (i*100)+'ms', "important");
        el.className = 'dual_layout';
        var head_s = this.get_head_s();
        var con_s = 'display: -webkit-flex;display: flex; justify-content:space-between; align-items: center;margin: 4% 0;';
        var el_s = 'vertical-align: middle;';
        var HTML  = '<div><div>';
        HTML += '<div><b style="'+head_s+';">'+this.data[i].title+'</b></div>';
        HTML += '<div style="display:inline-block;width:45%;height:100%;vertical-align:top;padding:0 2%;border-right: 1px solid #999999;">';
        HTML += this.data[i].imageurl != '' ? '<div style="margin:auto;width:100%"><img width="100%" src="static/images/'+this.data[i].imageurl+'"></div>': '<br>';
        HTML += this.data[i].description;
        HTML += '</div><div style="display:inline-block;width:46%;vertical-align:top;padding:0 2%;">';
        for(var j =0; j < this.data[i].price.length; j++){
            var price = this.data[i].price[j].split(' ');
            var pr = price.pop()
            HTML += '<div style="'+con_s+'"><span style="'+el_s+'">'+price.join(' ')+'</span><span style="text-shadow: 1px 2px 2px rgba(0, 0, 0, 0.8);color:red;'+el_s+'">'+pr+'</span></div>';
        }
        HTML += '</div></div></div>';
        el.innerHTML = HTML;
        return el;
    },
};


window.onload = function(){
    // обработчик выбора вкладок
    $('#video-foreground').css('filter', 'blur(10px)');
    $('#video-foreground').css('filter', 'blur(0px)');
    $('#toolbar').click(function(e){
        if(e.target.classList.contains("menu-button") ){
            CURRENT_WINDOW.classList.remove('menu-button-clicked');
            e.target.classList.add('menu-button-clicked');
            if(CURRENT_WINDOW != e.target){
                $('.content-page, .product-view').css('overflow', 'hidden');
            }
            CURRENT_WINDOW = e.target;
            if(orientation()){
                $('.product-view').html('');
                $('.categ').css('display', 'block');
            }
            else{
                if(e.target.dataset.offset == '0'){
                     $('#video-foreground').css('filter', 'blur(0px)');
                }
                else{
                     $('#video-foreground').css('filter', 'blur(10px)');
                }
            }
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
            if(orientation()){
                $('.categ').css('display', 'none');
            }
            fetchProduct(e.target.dataset.id, 1*this.dataset.vegan);
        }

    });
    if(!orientation()){
        $(SELECTED_CATEG).click();
        $(SELECTED_CATEG_VEGAN).click();
    }

}
