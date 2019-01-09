Ext.define('App.admin.Comment', {
    extend: 'Ext.grid.Panel',
    title: 'Панель управления отзывами',
    itemId:'PIDOR',
    store: Ext.create('Ext.data.Store', {
        autoLoad: true,
        fields:['id','name','comment','email','visible'],
        proxy: {
            type: 'ajax',
            url: '/admin/getComments',
            reader: {
                type: 'json',
                rootProperty: 'data'
            }
        }
    }),
    tbar:[
        {
            xtype: 'button',
            itemId:'changeComment',
            text: 'Показать/Скрыть комментарий',
            handler:function(btn){
                var sel = btn.up('gridpanel').getSelectionModel().getSelection()[0];
                if (sel){
                    Ext.Ajax.request({
                        url: '/admin/setComments',
                        method:'POST',
                        params:{
                            csrfmiddlewaretoken: getCookie('csrftoken'),
                            typeOperation: 'change',
                            id: sel.get('id'),
                        },
                        success: function(response, opts) {
                            btn.up('gridpanel').getStore().reload();
                            Ext.Msg.alert('Ответ', 'Видимость комментария измененена', Ext.emptyFn);
                        },

                        failure: function(response, opts) {
                            Ext.Msg.alert('Ошибка', 'Видимость комментария не измененена', Ext.emptyFn);
                        }
                    });
                }
                else{
                    Ext.Msg.alert('Ошибка', 'Строчка не выбрана', Ext.emptyFn);
                }
            },
        },
        {
            xtype: 'button',
            text: 'Удалить комментарий',
            handler:function(btn){
                var sel = btn.up('gridpanel').getSelectionModel().getSelection()[0];
                if (sel){
                    Ext.Ajax.request({
                        url: '/admin/setComments',
                        method:'POST',
                        params:{
                            csrfmiddlewaretoken: getCookie('csrftoken'),
                            typeOperation: 'del',
                            id: sel.get('id'),
                        },
                        success: function(response, opts) {
                            btn.up('gridpanel').getStore().reload();
                            Ext.Msg.alert('Ответ', 'Комментарий удален', Ext.emptyFn);
                        },

                        failure: function(response, opts) {
                            Ext.Msg.alert('Ошибка', 'Комментарий не удален', Ext.emptyFn);
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
            text: 'Удалить все скрытые комментарии',
            handler:function(btn){
                Ext.Ajax.request({
                    url: '/admin/setComments',
                    method:'POST',
                    params:{
                        csrfmiddlewaretoken: getCookie('csrftoken'),
                        typeOperation: 'delall',
                    },
                    success: function(response, opts) {
                        btn.up('gridpanel').getStore().reload();
                        Ext.Msg.alert('Ответ', 'Все скрытые комментарии удалены', Ext.emptyFn);
                    },

                    failure: function(response, opts) {
                        Ext.Msg.alert('Ошибка', 'Все скрытые комментарии не удалены', Ext.emptyFn);
                    }
                });
            },
        }
    ],
    plugins: [{
        ptype: 'rowexpander',
        rowBodyTpl: ['<div id="ux-row-expander-box-{id}">{comment}</div>'],
        expandOnRender: true,
        expandOnDblClick: true
    }],
    columns: [
        {
            text: 'Имя',
            dataIndex: 'name',
            flex: 3
        },
        {
            text: 'Почта',
            dataIndex: 'email',
            flex: 3
        },
        {
            text: 'Видимость',
            dataIndex: 'visible',
            flex: 1,
            renderer: function(value){
                return value ? 'Показан': 'Скрыт';
            }
        }
    ],
    listeners:{
        beforeshow: function(self, e){
            self.getStore().reload();
        },
        added: function(self, parent, i, e){
            self.getStore().reload();
        },
        select: function(self, record, index, eOpts ) {
//            this.getComponent('changeComment').setText(record.get('visible') ? 'Показан': 'Скрыт');
            console.log(self.up('gridpanel'));
        },
    },
});