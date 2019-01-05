Ext.define('App.admin.Content', {
    extend: 'Ext.form.Panel',
    title: 'Создание и редактирование категорий и продуктов',
    layout: {
                type: 'hbox',
                align: 'stretch'
            },

    items: [
        Ext.create('Ext.grid.Panel', {
            title:"Категории",
            border: true,
            flex:2,
            tbar:[
                {
                    xtype: 'button',
                    text: 'Добавить',
                },
                {
                    xtype: 'button',
                    text: 'Изменить',
                },
                {
                    xtype: 'button',
                    text: 'Удалить',
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
        }),
        Ext.create('Ext.grid.Panel', {
            title:"Список продуктов",
            border: true,
            flex:4,
            tbar:[
                {
                    xtype: 'button',
                    text: 'Добавить',
                },
                {
                    xtype: 'button',
                    text: 'Изменить',
                },
                {
                    xtype: 'button',
                    text: 'Удалить',
                },"->",
                {
                    xtype: 'button',
                    text: 'показать/скрыть',
                }
            ],
            columns: [
                { text: 'Название', dataIndex: 'name' , flex: 2},
                { text: 'Описание', dataIndex: 'email', flex: 4 },
                { text: 'Показан', dataIndex: 'email', flex: 1 },

            ],
        })
    ]
});