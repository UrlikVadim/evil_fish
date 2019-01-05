Ext.define('App.admin.Comment', {
    extend: 'Ext.form.Panel',
    title: 'Панель управления комментариями',
    layout: 'fit',
    items: [
        Ext.create('Ext.grid.Panel', {
            tbar:[
                {
                    xtype: 'button',
                    text: 'Показать',
                },
                {
                    xtype: 'button',
                    text: 'Удалить',
                }
            ],
            columns: [
                {
                    text: 'Имя',
                    dataIndex: 'name',
                    flex: 1
                },
                {
                    text: 'Почта',
                    dataIndex: 'email',
                    flex: 2
                },
                {
                    text: 'Комментарий',
                    dataIndex: 'phone',
                    flex: 6
                },
                {
                    text: 'Тип',
                    dataIndex: 'phone',
                    flex: 2
                }
            ],
        })
    ]
});