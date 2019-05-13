
var CURRENT_WINDOW = $('#toolbar').children()[0];
var SELECTED_CATEG = $('.categ > div')[0].firstElementChild;
var SELECTED_CATEG_VEGAN = $('.categ > div')[1].firstElementChild;

window.onload = function(){
    // обработчик выбора вкладок
    $('#toolbar').click(function(e){
        if(e.target.classList.contains("menu-button") && CURRENT_WINDOW != e.target){
            CURRENT_WINDOW.classList.remove('menu-button-clicked');
            e.target.classList.add('menu-button-clicked');
            CURRENT_WINDOW = e.target;
            $('.content-page').css('overflow', 'hidden');
            $('#slide-block').animate(
            {
                left: e.target.dataset.offset
            },
            500,
            function(){
                $('.content-page').css('overflow', 'auto');
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
        }

    });
    $(SELECTED_CATEG).click();
    $(SELECTED_CATEG_VEGAN).click();
}
