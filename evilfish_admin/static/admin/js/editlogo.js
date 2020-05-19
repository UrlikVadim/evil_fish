Ext.define('App.admin.Logo', {
    extend: 'Ext.form.Panel',
    title: 'Редактирование главной страницы',
    margin:'5px',
    GET_LOGO: null,
    SET_LOGO: null,
    layout: {
                type: 'vbox',
                align: 'stretch'
            },
    bbar:[
        {
            xtype: 'button',
            text: 'Сохранить изменения',
            handler: function(btn){
                Ext.Ajax.request({
                    url: btn.up('panel').SET_LOGO,
                    method:'POST',
                    params:{
                        csrfmiddlewaretoken: getCookie('csrftoken'),
                        phone:  btn.up('panel').getComponent('phone').getValue(),
                        urlvideo:  btn.up('panel').getComponent('urlvideo').getValue(),
                        mainhtml:  btn.up('panel').getComponent('mainhtml').getValue(),
                    },
                    success: function(response, opts) {
                        Ext.Msg.alert('Ответ', 'Изменения сохранены', Ext.emptyFn);
                    },

                    failure: function(response, opts) {
                        Ext.Msg.alert('Ошибка', 'Изменения не сохранены', Ext.emptyFn);
                    }
                });
            },
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
            itemId: 'phone',
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
            itemId: 'urlvideo',
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
            itemId: 'mainhtml',
            flex:1,
        }
    ],
    listeners:{
        beforeshow: function(self, e){
            Ext.Ajax.request({
                url: self.GET_LOGO,
                success: function(response, opts) {
                    var obj = Ext.decode(response.responseText);
                    self.getComponent('phone').setValue(obj.phone);
                    self.getComponent('urlvideo').setValue(obj.urlvideo);
                    self.getComponent('mainhtml').setValue(obj.mainhtml);
                },

                failure: function(response, opts) {
                    console.log('server-side failure with status code ' + response.status);
                }
            });
        },
        added: function(self, parent, i, e){
            Ext.Ajax.request({
                url: self.GET_LOGO,
                success: function(response, opts) {
                    var obj = Ext.decode(response.responseText);
                    self.getComponent('phone').setValue(obj.phone);
                    self.getComponent('urlvideo').setValue(obj.urlvideo);
                    self.getComponent('mainhtml').setValue(obj.mainhtml);
                },

                failure: function(response, opts) {
                    console.log('server-side failure with status code ' + response.status);
                }
            });
        },
    },
});