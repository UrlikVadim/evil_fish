Ext.application({
    name: 'Admin_panel',
    launch: function() {
        var app = Ext.create('Ext.container.Viewport', {
            layout: 'fit',
            items: [
                Ext.create('Ext.TabPanel', {
                    title:"Панель администратора",
                    tabBarPosition: 'top',
                    items: [
                        Ext.create('App.admin.Logo',{}),
                        Ext.create('App.admin.Content',{}),
                        Ext.create('App.admin.Comment',{}),
                    ],
                })
            ]
        });
    }
});