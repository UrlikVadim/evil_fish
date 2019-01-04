Ext.application({
    name: 'Admin_panel',
    launch: function() {
        Ext.create('Ext.container.Viewport', {
            layout: 'fit',
            items: [
                Ext.create('Ext.TabPanel', {
                    title:"Панель администратора",
                    fullscreen: true,
                    tabBarPosition: 'top',
                    animateShadow: true,
                    defaults: {
                        styleHtmlContent: true
                    },

                    items: [
                        Ext.create('App.admin.Logo',{}),
                        {
                            title: 'Контент',
                            iconCls: 'user',
                            html: 'Contact Screen'
                        },
                        {
                            title: 'Отзывы',
                            iconCls: 'user',
                            html: 'fefefefe'
                        }
                    ]
                })
            ]
        });
    }
});