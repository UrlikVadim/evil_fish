Ext.define('App.admin.Logo', {
    extend: 'Ext.form.Panel',
    title: 'Редактирование главного экрана',
    margin:'5px',
    layout: {
                type: 'vbox',
                align: 'stretch'
            },
    bbar:["->",
        {
            xtype: 'button',
            text: 'Сохранить изменения',
        }
    ],
    items: [
        {
            xtype:'label',
            html:'Номера телефонов',
            style: {
                'font-size': '2em',
                'padding': '10px',
            }
        },
        {
            xtype:'textfield',
        },
        {
            xtype:'label',
            html:'Ссылка на видео',
            style: {
                'font-size': '2em',
                'padding': '10px',
            }
        },
        {
            xtype:'textfield',
        },
        {
            xtype:'label',
            html:'Содержимое главной страницы',
            style: {
                'font-size': '2em',
                'padding': '10px',
            }
        },
        {
            xtype:'htmleditor',
            flex:1,
        }
    ]
});