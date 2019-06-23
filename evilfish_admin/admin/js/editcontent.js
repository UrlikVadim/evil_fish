var reload_store = null;
var selection_model = null;
var editProductWindow = Ext.create('Ext.window.Window', {
    itemId: 'editProductFields',
    layout: 'form',
    border: true,
    buttonAlign:'center',
    padding:'5px',
    resizable:false,
    modal:true,
    closable: false,
    closeAction: 'method-hide',
    width:'50%',
    viewModel: {
        data: {
            typeOperation:'',
            titleProduct:'',
            id:'',
            category_id:'',
            typecomp: '',
            title: '',
            description: '',
            price: '',
            imageurl: '',
            buttontext: 'Загрузить изображение',
        }
    },
    bind:{
        title: '{titleProduct} "{title}"',
    },
    buttons:[
        {
            xtype:'button',
            itemId: 'saveChanges',
            text:'Сохранить изменения',
            handler: function(btn){
                var vm = btn.up('window').getViewModel();
                Ext.Ajax.request({
                    url: '/admin/setProduct',
                    method:'POST',
                    params:{
                        csrfmiddlewaretoken: getCookie('csrftoken'),
                        typeOperation: vm.get('typeOperation'),
                        id: vm.get('id'),
                        category_id: vm.get('category_id'),
                        typecomp: vm.get('typecomp'),
                        title: vm.get('title'),
                        description: vm.get('description'),
                        price: vm.get('price'),
                        imageurl: vm.get('imageurl'),
                    },
                    success: function(response, opts) {
                        var params ={params:{category:vm.get('category_id')}};
                        reload_store.reload(params);
                        btn.up('window').hide();
                        Ext.Msg.alert('Ответ', response.responseText, Ext.emptyFn);
                    },

                    failure: function(response, opts) {
                        Ext.Msg.alert('Ошибка', response.responseText, Ext.emptyFn);
                    }
                });
            }
        },
        {
            xtype:'button',
            itemId: 'cancelChanges',
            text:'Отменить изменения',
            handler: function(btn){
                var vm = btn.up('window').getViewModel();
                if(vm.get('imageurl') != '' && vm.get('typeOperation') == 'add'){
                    Ext.Ajax.request({
                        url: '/admin/setFile',
                        method:'POST',
                        params:{
                            csrfmiddlewaretoken: getCookie('csrftoken'),
                            typeOperation:'del',
                            imageurl: vm.get('imageurl'),
                        },
                        success: function(response, opts) {
                            vm.set('imageurl', '');
                            vm.set('buttontext', 'Загрузить изображение');
                            Ext.Msg.alert('Ответ', 'Изображение удалено', Ext.emptyFn);
                        },

                        failure: function(response, opts) {
                            Ext.Msg.alert('Ошибка', 'Изображение не удалено', Ext.emptyFn);
                        }
                    });
                }
                if(vm.get('typeOperation') == 'upd'){
                    var sel = selection_model;
                    sel.set('imageurl', vm.get('imageurl'));
                }
                btn.up('window').hide();
            }
        }
    ],
    items:[
        {
            xtype:'combo',
            itemId: 'typecomp',
            fieldLabel:'Тип компоновки',
            valueField: 'type',
            displayField: 'value',
            store: Ext.create('Ext.data.Store', {
                fields: ['type', 'value'],
                data : [
                    {"type":"st", "value":"Стандартная компоновка"},
                    {"type":"d1", "value":"Двойная компоновка"}
                ]
            }),
            bind: {
                value: '{typecomp}'
            },
        },
        {
            xtype:'textfield',
            itemId: 'title',
            fieldLabel:'Название',
            bind: {
                value: '{title}'
            },
        },
        {
            xtype:'textarea',
            itemId: 'description',
            fieldLabel:'Описание',
            bind: {
                value: '{description}'
            },

        },
        {
            xtype:'textarea',
            itemId: 'price',
            fieldLabel:'Описание/Цена',
            bind: {
                value: '{price}'
            },

        },
        {
            xtype:'textfield',
            itemId: 'imageurl',
            disabled: true,
            fieldLabel:'Ссылка на изображение',
            bind: {
                value: '{imageurl}'
            },
        },
        {
            xtype:'button',
            itemId: 'changeimage',
            bind: {
                text: '{buttontext}'
            },
            handler: function(btn){
                var vm = btn.up('panel').getViewModel();
                if(vm.get('imageurl') == ""){
                    Ext.create('Ext.window.Window', {
                        title: 'Загрузить изображение',
                        buttonAlign:'center',
                        layout: 'fit',
                        padding:'5px',
                        resizable:false,
                        modal:true,
                        items:[
                            {
                                xtype:'form',
                                itemId:'uploadimageform',
                                url: '/admin/setFile',
                                items:[{
                                        xtype: 'filefield',
                                        name:'imageurl',
                                        itemId: 'description',
                                        fieldLabel:'Выберете фаил',
                                        buttonText:'Выбрать',
                                    },
                                    {
                                        xtype: 'textfield',
                                        name:'typeOperation',
                                        value:'add',
                                        hidden:true,
                                    },
                                    {
                                        xtype: 'textfield',
                                        name:'csrfmiddlewaretoken',
                                        value: getCookie('csrftoken'),
                                        hidden:true,
                                    },
                                    {
                                        xtype: 'textfield',
                                        name:'product_id',
                                        value: vm.get('id'),
                                        hidden:true,
                                    },
                                    {
                                        xtype: 'textfield',
                                        name:'change_product',
                                        value: vm.get('typeOperation'),
                                        hidden:true,
                                    }
                                ],
                            }
                        ],
                        buttons:[
                            {
                                xtype:'button',
                                itemId: 'uploadImage',
                                text:'OK',
                                handler: function(b){
                                    var form = b.up('window').getComponent('uploadimageform').getForm();
                                    if (form.isValid()) {
                                        form.submit({
                                            success: function(form, action) {
                                                vm.set('buttontext', 'Удалить изображение');
                                                vm.set('imageurl', action.result.msg);
                                                b.up('window').close();
                                            },
                                            failure: function(form, action) {
                                                Ext.Msg.alert('Ошибка', action.result.msg, Ext.emptyFn);
                                            }
                                        });
                                    }
                                    else{
                                        Ext.Msg.alert('Ответ', 'Форма не валидная', Ext.emptyFn);
                                    }
                                }
                            },
                        ]
                    }).show();
                }
                else{
                    Ext.Ajax.request({
                        url: '/admin/setFile',
                        method:'POST',
                        params:{
                            csrfmiddlewaretoken: getCookie('csrftoken'),
                            typeOperation:'del',
                            imageurl: vm.get('imageurl'),
                            product_id:vm.get('id'),
                            change_product: vm.get('typeOperation'),
                        },
                        success: function(response, opts) {
                            vm.set('imageurl', '');
                            vm.set('buttontext', 'Загрузить изображение');
                            Ext.Msg.alert('Ответ', response.responseText, Ext.emptyFn);
                        },

                        failure: function(response, opts) {
                            Ext.Msg.alert('Ошибка', response.responseText, Ext.emptyFn);
                        }
                    });
                }
            }
        },
    ]
});



Ext.define('App.admin.Content', {
    extend: 'Ext.form.Panel',
    xtype:'editcontent',
    reference: 'editcontent',
    title: 'Создание и редактирование категорий и продуктов',
    layout: {
        type: 'hbox',
        align: 'stretch'
    },
    items: [
        {
            xtype:'gridpanel',
            title:"Категории",
            itemId: 'categoryList',
            border: true,
            flex:2,
            store: Ext.create('Ext.data.Store', {
                autoLoad: true,
                fields:['id','name','vegan'],
                proxy: {
                    type: 'ajax',
                    url: '/admin/getCategory',
                    reader: {
                        type: 'json',
                        rootProperty: 'data'
                    }
                },
            }),
            tbar:[
                {
                    xtype: 'button',
                    text: 'Добавить',
                    itemId: 'addButton',
                    handler: function(btn){
                        Ext.create('Ext.window.Window', {
                            title: 'Создать категорию',
                            itemId: 'uploadimageform',
                            buttonAlign:'center',
                            layout: 'form',
                            width:'500px',
                            resizable:false,
                            modal:true,
                            items:[
                                {
                                    xtype: 'textfield',
                                    itemId: 'name',
                                    fieldLabel:'Название раздела',
                                },
                                {
                                    xtype:'combo',
                                    itemId: 'typecategory',
                                    fieldLabel:'Тип меню',
                                    valueField: 'type',
                                    displayField: 'value',
                                    value: 0,
                                    store: Ext.create('Ext.data.Store', {
                                        fields: ['type', 'value'],
                                        data : [
                                            {"type":0, "value": "Обычное"},
                                            {"type":1, "value": "Веганское"}
                                        ]
                                    })
                                }
                            ],
                            buttons:[
                                {
                                    xtype:'button',
                                    text:'Добавить',
                                    handler: function(b){
                                       Ext.Ajax.request({
                                            url: '/admin/setCategory',
                                            method:'POST',
                                            params:{
                                                csrfmiddlewaretoken: getCookie('csrftoken'),
                                                typeOperation: 'add',
                                                name: b.up('window').getComponent('name').getValue(),
                                                vegan: b.up('window').getComponent('typecategory').getValue(),
                                            },
                                            success: function(response, opts) {
                                                btn.up('gridpanel').getStore().reload();
                                                Ext.Msg.alert('Ответ', 'Категория создана', Ext.emptyFn);
                                            },

                                            failure: function(response, opts) {
                                                Ext.Msg.alert('Ошибка', 'Категория не создана', Ext.emptyFn);
                                            }
                                       });
                                    }
                                },
                            ]
                        }).show();
                    }
                },
                {
                    xtype: 'button',
                    text: 'Изменить',
                    itemId: 'updateButton',
                    handler: function(btn){
                        var sel = btn.up('gridpanel').getSelectionModel().getSelection()[0];
                        if(sel){
                            Ext.create('Ext.window.Window', {
                            title: 'Обновить категорию',
                            itemId: 'uploadimageform',
                            buttonAlign:'center',
                            layout: 'form',
                            width:'500px',
                            resizable:false,
                            modal:true,
                            items:[
                                {
                                    xtype: 'textfield',
                                    itemId: 'name',
                                    fieldLabel:'Название раздела',
                                    value: sel.get('name'),
                                },
                                {
                                    xtype:'combo',
                                    itemId: 'typecategory',
                                    fieldLabel:'Тип меню',
                                    valueField: 'type',
                                    displayField: 'value',
                                    value: sel.get('vegan')*1,
                                    store: Ext.create('Ext.data.Store', {
                                        fields: ['type', 'value'],
                                        data : [
                                            {"type":0, "value": "Обычное"},
                                            {"type":1, "value": "Веганское"}
                                        ]
                                    })
                                }
                            ],
                            buttons:[
                                {
                                    xtype:'button',
                                    text:'Обновить',
                                    handler: function(b){
                                       Ext.Ajax.request({
                                            url: '/admin/setCategory',
                                            method:'POST',
                                            params:{
                                                csrfmiddlewaretoken: getCookie('csrftoken'),
                                                typeOperation: 'upd',
                                                id: sel.get('id'),
                                                name: b.up('window').getComponent('name').getValue(),
                                                vegan: b.up('window').getComponent('typecategory').getValue(),
                                            },
                                            success: function(response, opts) {
                                                btn.up('gridpanel').getStore().reload();
                                                b.up('window').close();
                                                Ext.Msg.alert('Ответ', 'Категория обновлена', Ext.emptyFn);
                                            },

                                            failure: function(response, opts) {
                                                Ext.Msg.alert('Ошибка', 'Категория не обновлена', Ext.emptyFn);
                                            }
                                       });
                                    }
                                },
                            ]
                        }).show();
                        }
                        else{
                            Ext.Msg.alert('Ошибка', 'Строчка не выбрана', Ext.emptyFn);
                        }
                    },
                },
                {
                    xtype: 'button',
                    text: 'Удалить',
                    itemId: 'removeButton',
                    handler: function(btn){
                        var sel = btn.up('gridpanel').getSelectionModel().getSelection()[0];
                        if(sel){
                            Ext.Ajax.request({
                                url: '/admin/setCategory',
                                method:'POST',
                                params:{
                                    csrfmiddlewaretoken: getCookie('csrftoken'),
                                    typeOperation: 'del',
                                    id:sel.get('id'),
                                },
                                success: function(response, opts) {
                                    btn.up('gridpanel').getStore().reload();
                                    btn.up('gridpanel').up('panel').getComponent('productList').setTitle("Выберете категорию чтобы посмотреть список продуктов");
                                    btn.up('gridpanel').up('panel').getComponent('productList').setDisabled(true);
                                    Ext.Msg.alert('Ответ', 'Категория удалена', Ext.emptyFn);
                                },

                                failure: function(response, opts) {
                                    Ext.Msg.alert('Ошибка', 'Категория не удалена', Ext.emptyFn);
                                }
                            });
                        }
                        else{
                            Ext.Msg.alert('Ошибка', 'Строчка не выбрана', Ext.emptyFn);
                        }
                    },
                }
            ],
            columns: [
                {
                    text: 'Индекс',
                    dataIndex: 'id',
                    flex: 2
                },
                {
                    text: 'Имя',
                    dataIndex: 'name',
                    flex: 6,
                    renderer: function(value){
                        return '<b style="color: black;">'+value+'</b>';
                    }
                },
                {
                    text: 'Тип',
                    dataIndex: 'vegan',
                    flex: 4,
                    renderer: function(value){
                        return value ? 'Веганское': 'Обычное';
                    }
                }
            ],
            listeners:{
                rowclick: function(self, record, element, rowIndex, e, eOpts ) {
//                            this.getComponent('changeComment').setText(record.get('visible') ? 'Показан': 'Скрыт');
                    var params ={params:{category:record.get('id')}};
                    this.up('panel').getComponent('productList').setTitle('Список продуктов "'+record.get('name')+' ('+(record.get('vegan')?'Веганское':'Обычное')+')"');
                    this.up('panel').getComponent('productList').setDisabled(false);
                    this.up('panel').getComponent('productList').getStore().reload(params);
                },
            },
        },
        {
            xtype:'gridpanel',
            title:"Выберете категорию чтобы посмотреть список продуктов",
            itemId: 'productList',
            border: true,
            disabled: true,
            flex:4,
            store: Ext.create('Ext.data.Store', {
                autoLoad: true,
                fields:['id','title','description','category_id','typecomp','price','visible','imageurl'],
                proxy: {
                    type: 'ajax',
                    url: '/admin/getProduct',
                    reader: {
                        type: 'json',
                        rootProperty: 'data'
                    }
                }
            }),
            tbar:[
                {
                    xtype: 'button',
                    text: 'Добавить продукт',
                    itemId: 'addButton',
                    handler: function(btn){
                        var sel = btn.up('gridpanel').up('panel').getComponent('categoryList').getSelectionModel().getSelection()[0];
                        if(sel){
                            var editProductsModel = editProductWindow.getViewModel();
                            editProductsModel.set('typeOperation', 'add');
                            editProductsModel.set('titleProduct', 'Создание продукта');
                            editProductsModel.set('id', '');
                            editProductsModel.set('category_id', sel.get('id'));
                            editProductsModel.set('typecomp', 'standart');
                            editProductsModel.set('title', '');
                            editProductsModel.set('description', '');
                            editProductsModel.set('price', '');
                            editProductsModel.set('imageurl', '');
                            editProductsModel.set('buttontext', 'Загрузить изображение');
                            selection_model = sel;
                            reload_store = btn.up('gridpanel').getStore();
                            editProductWindow.show();
                        }
                        else{
                            Ext.Msg.alert('Ошибка', 'Выберете категорию для добавления продукта', Ext.emptyFn);
                        }
                    }
                },
                {
                    xtype: 'button',
                    text: 'Изменить продукт',
                    itemId: 'updateButton',
                    handler: function(btn){
                        var sel = btn.up('gridpanel').getSelectionModel().getSelection()[0];
                        var selc = btn.up('gridpanel').up('panel').getComponent('categoryList').getSelectionModel().getSelection()[0];
                        if(sel && selc){
                            var editProductsModel = editProductWindow.getViewModel();
                            editProductsModel.set('typeOperation', 'upd');
                            editProductsModel.set('titleProduct', 'Изменение продукта');
                            editProductsModel.set('id', sel.get('id'));
                            editProductsModel.set('category_id', selc.get('id'));
                            editProductsModel.set('typecomp', sel.get('typecomp'));
                            editProductsModel.set('title', sel.get('title'));
                            editProductsModel.set('description', sel.get('description'));
                            editProductsModel.set('price', sel.get('price'));
                            editProductsModel.set('imageurl', sel.get('imageurl'));
                            editProductsModel.set('buttontext', sel.get('imageurl')==""?'Загрузить изображение':'Удалить изображение');
                            selection_model = sel;
                            reload_store = btn.up('gridpanel').getStore();
                            editProductWindow.show();
                        }
                        else{
                            Ext.Msg.alert('Ошибка', 'Строчка не выбрана', Ext.emptyFn);
                        }
                    },
                },
                {
                    xtype: 'button',
                    text: 'Удалить продукт',
                    itemId: 'removeButton',
                    handler: function(btn){
                        var sel = btn.up('gridpanel').getSelectionModel().getSelection()[0];
                        if(sel){
                            Ext.Ajax.request({
                                url: '/admin/setProduct',
                                method:'POST',
                                params:{
                                    csrfmiddlewaretoken: getCookie('csrftoken'),
                                    typeOperation: 'del',
                                    id:sel.get('id'),
                                },
                                success: function(response, opts) {
                                    btn.up('gridpanel').getStore().reload();
                                    Ext.Msg.alert('Ответ', 'Продукт удален', Ext.emptyFn);
                                },

                                failure: function(response, opts) {
                                    Ext.Msg.alert('Ошибка', 'Продукт не удален', Ext.emptyFn);
                                }
                            });
                        }
                        else{
                            Ext.Msg.alert('Ошибка', 'Строчка не выбрана', Ext.emptyFn);
                        }
                    },
                },"->",
                {
                    xtype: 'button',
                    text: 'Показать/Скрыть продукт',
                    itemId: 'changeProduct',
                    handler: function(btn){
                        var sel = btn.up('gridpanel').getSelectionModel().getSelection()[0];
                        if(sel){
                            Ext.Ajax.request({
                                url: '/admin/setProduct',
                                method:'POST',
                                params:{
                                    csrfmiddlewaretoken: getCookie('csrftoken'),
                                    typeOperation: 'vis',
                                    id:sel.get('id'),
                                },
                                success: function(response, opts) {
                                    btn.up('gridpanel').getStore().reload();
                                    btn.setText(sel.get('visible') ? 'Показать продукт': 'Скрыть продукт');
                                    Ext.Msg.alert('Ответ', 'Видимость продукта изменена', Ext.emptyFn);
                                },

                                failure: function(response, opts) {
                                    Ext.Msg.alert('Ошибка', 'Видимость продукта не изменена', Ext.emptyFn);
                                }
                            });
                        }
                        else{
                            Ext.Msg.alert('Ошибка', 'Строчка не выбрана', Ext.emptyFn);
                        }
                    },
                }
            ],
            columns: [
                {
                    text: 'Название',
                    dataIndex: 'title',
                    flex: 2,
                    renderer: function(value){
                        return '<b style="color: blue;">'+value+'</b>';
                    }
                },
                {
                    text: 'Описание',
                    dataIndex: 'description',
                    flex: 4,
                },
                {
                    text: 'Показан',
                    dataIndex: 'visible',
                    flex: 1,
                    renderer: function(value){
                        return value ? '<b style="color: green;">Да</b>': '<b style="color: red;">Нет</b>';
                    }
                },
            ],
            listeners:{
                rowclick: function(self, record, element, rowIndex, e, eOpts ) {
                    this.getDockedItems('toolbar[dock="top"]')[0].getComponent('changeProduct').setText(record.get('visible') ? 'Скрыть продукт': 'Показать продукт');
                },
            },
        }
    ],
    listeners:{
        beforeshow: function(self, e){
            self.getComponent('categoryList').getStore().reload();
        },
        added: function(self, parent, i, e){
            self.getComponent('categoryList').getStore().reload();
        },
    },
});
