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
                    tbar:[
                        {
                            xtype: 'button',
                            text: 'Добавить',
                            itemId: 'addButton',
                            handler: function(){
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
                                            fieldLabel:'название раздела',
                                        },
                                        {
                                            xtype:'combo',
                                            itemId: 'typecategory',
                                            fieldLabel:'Тип меню',
                                            valueField: 'type',
                                            displayField: 'value',
                                            value: false,
                                            store: Ext.create('Ext.data.Store', {
                                                fields: ['type', 'value'],
                                                data : [
                                                    {"type":false, "value": "Обычное"},
                                                    {"type":true, "value": "Веганское"}
                                                ]
                                            })
                                        }
                                    ],
                                    buttons:[
                                        {
                                            xtype:'button',
                                            itemId: 'uploadImage',
                                            text:'OK',
                                            handler: function(btn){
                                                Ext.Ajax.request({
                                                     url: 'ajax_demo/sample.json',

                                                     success: function(response, opts) {
                                                         var obj = Ext.decode(response.responseText);
                                                         console.dir(obj);
                                                     },

                                                     failure: function(response, opts) {
                                                         console.log('server-side failure with status code ' + response.status);
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
                        },
                        {
                            xtype: 'button',
                            text: 'Удалить',
                            itemId: 'removeButton',
                        }
                    ],
                    columns: [
                        {
                            text: 'Индекс',
                            dataIndex: 'name',
                            flex: 2
                        },
                        {
                            text: 'Имя',
                            dataIndex: 'email',
                            flex: 6
                        },
                        {
                            text: 'Тип',
                            dataIndex: 'phone',
                            flex: 4
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
                            text: 'Добавить',
                            itemId: 'addButton',
                            handler: function(btn){
                                var editProductsModel = btn.up('gridpanel').up('panel').up('editcontent').getComponent('editProduct').getComponent('editProductFields').getViewModel();
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
                            text: 'Изменить',
                            itemId: 'updateButton',
                        },
                        {
                            xtype: 'button',
                            text: 'Удалить',
                            itemId: 'removeButton',
                        },"->",
                        {
                            xtype: 'button',
                            text: 'показать/скрыть',
                            itemId: 'changeButton',
                        }
                    ],
                    columns: [
                        { text: 'Название', dataIndex: 'name' , flex: 2},
                        { text: 'Описание', dataIndex: 'email', flex: 4 },
                        { text: 'Показан', dataIndex: 'email', flex: 1 },
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
                    title: 'Поля',
                    itemId: 'editProductFields',
                    layout: 'form',
                    border: true,
                    flex:1,
                    viewModel: {
                        data: {
                            typecomp: 'standart',
                            title: '',
                            description: '',
                            price: '',
                            imageurl: '',
                            buttontext: 'Загрузить изображение',
                        }
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
                                    width:'500px',
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
                                            handler: function(){
                                                btn.up('panel').getComponent('imageurl').setValue('kek');
                                                btn.up('panel').getViewModel().set('buttontext', 'Удалить изображение');
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
    ]
});