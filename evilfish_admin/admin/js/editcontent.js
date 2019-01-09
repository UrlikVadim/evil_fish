Ext.define('App.admin.Content', {
    extend: 'Ext.form.Panel',
    xtype:'editcontent',
    reference: 'editcontent',
    title: 'Создание и редактирование категорий и продуктов',
    layout: 'card',
    items: [
        {
            xtype:'panel',
            itemId: 'tableProduct',
            layout: {
                type: 'hbox',
                align: 'stretch'
            },
            items:[
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
                        }
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
                            flex: 6
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
                },
                {
                    xtype:'gridpanel',
                    title:"Список продуктов",
                    itemId: 'productList',
                    border: true,
                    flex:4,
                    tbar:[
                        {
                            xtype: 'button',
                            text: 'Добавить продукт',
                            itemId: 'addButton',
                            handler: function(btn){
                                var editProductsModel = btn.up('gridpanel').up('panel').up('editcontent').getComponent('editProduct').getComponent('editProductFields').getViewModel();
                                editProductsModel.set('titleProduct', 'Создание продукта');
                                editProductsModel.set('id', '');
                                editProductsModel.set('typecomp', 'standart');
                                editProductsModel.set('title', '');
                                editProductsModel.set('description', '');
                                editProductsModel.set('price', '');
                                editProductsModel.set('imageurl', '');
                                editProductsModel.set('buttontext', 'Загрузить изображение');
                                btn.up('gridpanel').up('panel').up('editcontent').getLayout().setActiveItem(1);
                            }
                        },
                        {
                            xtype: 'button',
                            text: 'Изменить продукт',
                            itemId: 'updateButton',
                        },
                        {
                            xtype: 'button',
                            text: 'Удалить продукт',
                            itemId: 'removeButton',
                        },"->",
                        {
                            xtype: 'button',
                            text: 'Показать/Скрыть продукт',
                            itemId: 'changeButton',
                        }
                    ],
                    columns: [
                        { text: 'Название', dataIndex: 'name' , flex: 2},
                        { text: 'Описание', dataIndex: 'email', flex: 4 },
                        {
                            text: 'Показан',
                            dataIndex: 'email',
                            flex: 1,
                            renderer: function(value){
                                return value ? 'Да': 'Нет';
                            }
                        },
                    ],
                }
            ]
        },
        {
            xtype:'panel',
            itemId: 'editProduct',
            layout: {
                type: 'hbox',
                align: 'stretch'
            },
            bbar:[
                {
                    xtype:'button',
                    itemId: 'cancelChanges',
                    text:'Отменить изменения',
                    handler: function(btn){
                        btn.up('panel').up('editcontent').getLayout().setActiveItem(0);
                    }
                },
                {
                    xtype:'button',
                    itemId: 'saveChanges',
                    text:'Сохранить изменения',
                    handler: function(btn){
                        btn.up('panel').up('editcontent').getLayout().setActiveItem(0);
                    }
                },"->",
                {
                    xtype:'button',
                    itemId: 'ubdateView',
                    text:'Обновить предпросмотр',
                    handler: function(btn){

                    }
                }
            ],
            items:[
                {
                    xtype:'panel',
                    itemId: 'editProductFields',
                    layout: 'form',
                    border: true,
                    flex:1,
                    viewModel: {
                        data: {
                            typeOperation:'',
                            titlePanel:'Создание продукта',
                            id:'',
                            category_id:'',
                            typecomp: 'standart',
                            title: '',
                            description: '',
                            price: '',
                            imageurl: '',
                            buttontext: 'Загрузить изображение',
                        }
                    },
                    bind:{
                        title: '{titlePanel} "{title}"',
                    },
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
                                    {"type":"standart", "value":"Стандартная компоновка"},
                                    {"type":"pizza", "value":"Компоновка пиццы"},
                                    {"type":"other", "value":"Другая компоновка"}
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
                                Ext.create('Ext.window.Window', {
                                    title: 'Загрузить изображение',
                                    itemId: 'uploadimageform',
                                    buttonAlign:'center',
                                    layout: 'form',
                                    width:'400px',
                                    resizable:false,
                                    modal:true,
                                    items: {
                                        xtype: 'filefield',
                                        itemId: 'description',
                                        fieldLabel:'Выберете фаил',
                                        buttonText:'Выбрать',
                                    },
                                    buttons:[
                                        {
                                            xtype:'button',
                                            itemId: 'uploadImage',
                                            text:'OK',
                                            handler: function(b){
                                                btn.up('panel').getViewModel().set('imageurl', 'Удалить изображение');
                                                btn.up('panel').getViewModel().set('buttontext', 'Удалить изображение');
                                                b.up('window').close();
                                            }
                                        },
                                    ]
                                }).show();
                            }
                        },
                    ]
                },
                {
                    xtype:'panel',
                    title: 'Предварительный просмотр',
                    itemId: 'viewProduct',
                    layout: 'fit',
                    border: true,
                    flex:1,
                    html: '<div style="background: linear-gradient(to right, gray, #eeeeee);height: 100%;width: 100%;"></div>'
                }
            ]
        }
    ],
    listeners:{
        beforeshow: function(self, e){
            self.getComponent('tableProduct').getComponent('categoryList').getStore().reload();
        },
        added: function(self, parent, i, e){
            self.getComponent('tableProduct').getComponent('categoryList').getStore().reload();
        },
    },
});