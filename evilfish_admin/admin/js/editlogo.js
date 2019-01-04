Ext.define('App.admin.Logo', {
    extend: 'Ext.form.Panel',
    title: 'Лого',
    layout: 'form',

    defaultType: 'textfield',
    tbar:["->",
        {
            xtype: 'button',
            text: 'Сохранить изменения',
        }
    ],
    items: [
        {
            xtype:'textfield',
            fieldLabel:'Ссылка на видео',
        },
        {
            xtype:'htmleditor',
            fieldLabel:'Главная страница',

        }
    ]
});