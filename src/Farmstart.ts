// TypeScript file

/**
 * farm_start extends eui.compa
 */

class Farmstart extends eui.Component {



    static _self = null;
    public scroller: eui.Scroller = null;
    public viewportGroup: eui.Group = null;
    public farm_land_bg: eui.Image = null; //背景主图

    //第二屏替换组 如果用户有第七块土地 则该组显示
    public farm_less_six: eui.Group = null;

    //农场动物组
    public farm_land_animal: eui.Group = null;

    //第二组农场展板
    public group2_label_1: eui.Label = null;
    public group2_label_2: eui.Label = null;
    public group2_label_3: eui.Label = null;
    public group2_label_4: eui.Label = null;

    //用户信息牌
    public farm_group2_set: eui.Image = null;
    public farm_area: eui.Label = null;//农场面积
    public farm_name: eui.Label = null;//农场名称

    //用户土地第一组
    public farm_land_group: eui.Group = null;

    //用户土地第二组
    public farm_land_group2: eui.Group = null;



    //http请求实例
    private https: HttpRes = null;

    //----------动画组--------------

    //提示动画组


    private alert_tip: egret.tween.TweenGroup = null;;

    public alert_manage: eui.Group = null;

    //用户播种强提示
    public farm_seed_manage: eui.Group = null;
    //-----------movieclip-------------

    //牌子
    public farm_land_arrow: eui.Group = null;
    //牌子
    public farm_set_group: eui.Group = null;
    //灯
    public farm_land_light: eui.Group = null;
    //狗子
    public farm_land_dog: eui.Group = null;
    //农场小鸡组
    public farm_chick0: eui.Group = null;
    public farm_chick1: eui.Group = null;
    public farm_chick2: eui.Group = null;
    public farm_chick3: eui.Group = null;
    public farm_chick4: eui.Group = null;






    public landType = []//土地状态数组
    public scType = []//蔬菜状态数组
    public optionType = [] //操作状态数组
    public landArea = [] //土地面积数组



    //-----------方法调用，监听------------
    //ui对象组
    private Farmstart_ui_objs: eui.UIComponent[] = new Array();
    //回调方法组
    private Farmstart_func_calls: Function[] = new Array();


    constructor() {
        super()
        this.addEventListener(eui.UIEvent.COMPLETE, this.complete_load, this);
        this.skinName = "resource/myskins/farm_start.exml";
    }

    private complete_load() {
        Farmstart._self = this
        console.log("页面加载完成回调")
        this.alert_tip.addEventListener('itemComplete', this.onTweenItemComplete, this);
        this.start_tip_anim();
    }


    protected childrenCreated(): void {
        super.childrenCreated();


        this.scroller.viewport = this.viewportGroup;
        this.scroller.bounces = false;
        this.scroller.horizontalScrollBar.autoVisibility = false;
        this.scroller.verticalScrollBar.autoVisibility = false;
        this.scroller.viewport.scrollH = 0;   //屏幕初始化位置



        //-----------点击监听方法组---------------------
        this.Farmstart_ui_objs.push(this.farm_set_group, this.alert_manage);
        this.Farmstart_func_calls.push(this.farm_test, this.user_tip_handle);
        this.ClickEvent_Listerner(this.Farmstart_ui_objs, this.Farmstart_func_calls);

        //------------向服务器请求用户数据------------

        // let data = 'type=0&tt=666'
        // Farmstart.self = this
        // this.https = new HttpRes(this.httpscallback.bind(Farmstart.self));
        // this.https.setUrl("http://172.16.0.67:8001/future/num", "POST", "application/x-www-form-urlencoded", data);
        // this.https.httpInit();

        var request = new egret.HttpRequest();
        request.responseType = egret.HttpResponseType.TEXT;
        //设置为 POST 请求
        //let url = 'http://172.16.0.67:8001/future/num'
        let url = 'https://www.easy-mock.com/mock/5c6cb28f241b092e864e1528/getdata'
        request.open(url, egret.HttpMethod.POST);
        request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        request.send();
        // request.addEventListener(egret.Event.COMPLETE, this.onPostComplete.bind( this,null, this.test), this);
        request.addEventListener(egret.Event.COMPLETE, this.onPostComplete, this);


    }

    // //请求回调
    // private httpscallback() {
    //     let res = JSON.parse(Farmstart.self.https.getDatas())
    //     console.log(res);
    // }


    //点击注册事件方法[ui_objs:响应对象组 callbacks:回调方法组]
    private ClickEvent_Listerner(ui_objs: eui.UIComponent[], callbacks: Function[]) {
        let leng: number = callbacks.length;
        if (ui_objs.length != leng) { return; }
        for (let i = 0; i < leng; i++) {
            ui_objs[i].addEventListener(egret.TouchEvent.TOUCH_BEGIN, callbacks[i], ui_objs[i]);
        }
    }

    //请求加载完成回调
    private onPostComplete(evt: egret.Event) {
        let request = <egret.HttpRequest>evt.currentTarget;

        // console.log(request)
        let res = JSON.parse(request.response);

        this.farm_name.text = `${res.username}农场`
        this.farm_area.text = `${res.total_area}㎡`

        //第二块板赋值
        if (res.word) {

            this.group2_label_1.text = res.word[0]
            this.group2_label_2.text = res.word[1]
            this.group2_label_3.text = res.word[2]
            this.group2_label_3.text = res.word[3]
        }

        for (var i = 0; i < res.num.length; i++) {
            let scindex = res.num[i]
            let optionindex = res.num2[i]
            let Area = res.area[i]
            let ltype = res.landType[i]

            console.log(OptionType[optionindex])
            console.log(ScType[scindex])
            console.log(res.area[i])

            this.scType.push(ScType[scindex])
            this.optionType.push(OptionType[optionindex])
            this.landArea.push(Area)
            this.landType.push(ltype)
        }

        this.initLand(this.farm_land_group, this.scType, this.optionType, this.landArea, this.landType);


        //      用户土地超过6
        if (res.num.length > 6) {

            this.farm_group2_set.visible = false
            //更改土地状态
            this.farm_land_group2.visible = true
            this.farm_less_six.visible = false

            this.initLand2(this.farm_land_group2, this.scType, this.optionType, this.landArea, this.landType)
        }
        //创建动画
        this.CreateAnima()

    }


    //初始化6土地

    private initLand(parent: eui.Group, scType, Optype, landArea, landType) {
        console.log(scType)

        //Xoff,Yoff是提示用户图标的偏移
        let Xoff = 172
        let Yoff = 19

        let pos: egret.Point[] = new Array(6);
        pos[0] = new egret.Point(41, 0);
        pos[1] = new egret.Point(257.38, 112);
        pos[2] = new egret.Point(8.72, 209);
        pos[3] = new egret.Point(246.72, 321);
        pos[4] = new egret.Point(0, 423);
        pos[5] = new egret.Point(241.38, 538);

        for (let i = 0; i < pos.length; i++) {
            //创建农场土地
            let farmland: Farmland = new Farmland(i, landArea[i], landType[i]);
            //创建操作状态,传入类节点
            let anim = new control_anim(Optype[i], farmland)
            // console.log(Optype[2])
            //设立坐标组
            farmland.$x = pos[i].x + 50;
            farmland.$y = pos[i].y;

            anim.$x = pos[i].x + Xoff;
            anim.$y = pos[i].y + Yoff;
            // console.log(scType[i])
            //通过枚举更改土地状态,操作状态 的资源图片

            // farmland.change_Landpic(landtype[i])
            farmland.change_Caipic(scType[i])
            anim.change_image(Optype[i])


            parent.addChild(farmland);
            parent.addChild(anim);

            //监听点击事件
            // farmland.addEventListener(egret.TouchEvent.TOUCH_TAP, this.farmland_handle.bind(this, i), this)
        }

        console.log("添加土地")
    }


    private initLand2(parent: eui.Group, scType, Optype, landArea, landType) {

        console.log(scType)
        //Xoff,Yoff是提示用户图标的偏移
        let Xoff = 172
        let Yoff = 19

        let pos: egret.Point[] = new Array(2);
        pos[6] = new egret.Point(31.38, 0);
        pos[7] = new egret.Point(257.38, 112);
        pos[8] = new egret.Point(8.72, 209);
        pos[9] = new egret.Point(246.72, 321);
        pos[10] = new egret.Point(0, 423);
        pos[11] = new egret.Point(241.38, 538);


        for (let i = 6; i < pos.length; i++) {
            //创建农场土地
            let farmland: Farmland = new Farmland(i, landArea[i], landType[i]);
            //创建操作状态
            let anim = new control_anim(Optype[i], farmland)

            //设立坐标组
            farmland.$x = pos[i].x + 50;
            farmland.y = pos[i].y;

            anim.x = pos[i].x + Xoff;
            anim.y = pos[i].y + Yoff;
            // console.log(scType[i])
            //通过枚举更改土地状态,操作状态 的资源图片

            // farmland.change_Landpic(landtype[i])
            farmland.change_Caipic(scType[i])
            anim.change_image(Optype[i])

            parent.addChild(farmland);
            parent.addChild(anim);
            console.log(farmland.CreateLandId)


        }
        console.log("添加第二屏幕土地")
    }



    //-----------------操作回调方法----------

    //动画开始
    public start_tip_anim() {
        this.alert_tip.play(0);
    }

    //动画停止
    public end_tip_anim() {
        this.alert_tip.stop();
    }

    //监听动画组某个动画播放完成
    private onTweenItemComplete(event: egret.Event) {
        const item = event.data as egret.tween.TweenItem;
        this.start_tip_anim();
    }

    //土地点击监听
    public farmland_handle(id, evt: egret.TouchEvent) {
        console.log(id)
        console.log(evt)

    };


    //创建动画集合
    public CreateAnima() {
        //创建灯动画
        let arrow = GameUtil.createMovieClipByName('arrow', 'arrow')
        arrow.gotoAndPlay(0, - 1)
        this.farm_land_arrow.addChild(arrow)



        //创建灯动画
        let light = GameUtil.createMovieClipByName('farm_light', '灯')
        light.gotoAndPlay(0, - 1)
        this.farm_land_light.addChild(light)


        // 创建狗动画
        let dog = GameUtil.createMovieClipByName('dog', '绿狗子')

        dog.gotoAndPlay(0, -1)
        this.farm_land_dog.addChild(dog)


        //创建农场动画
        let chick0 = GameUtil.createMovieClipByName('animal', 'animal1')
        let chick1 = GameUtil.createMovieClipByName('animal', 'animal1')
        let chick2 = GameUtil.createMovieClipByName('animal', 'animal2')
        let chick3 = GameUtil.createMovieClipByName('animal', 'animal3')
        let chick4 = GameUtil.createMovieClipByName('animal', 'animal4')

        chick0.gotoAndPlay(0, -1)
        chick1.gotoAndPlay(0, -1)
        chick2.gotoAndPlay(0, -1)
        chick3.gotoAndPlay(0, -1)
        chick4.gotoAndPlay(0, -1)

        this.farm_chick0.addChild(chick0)
        this.farm_chick1.addChild(chick1)
        this.farm_chick2.addChild(chick2)
        this.farm_chick3.addChild(chick3)
        this.farm_chick4.addChild(chick4)



    }
    //测试
    public farm_test() {
        console.log(1)

    }
    //
    public user_tip_handle() {
        console.log('tip')
        Farmstart._self.farm_seed_manage.visible = true
        setTimeout(() => {
            Farmstart._self.farm_seed_manage.visible = false
        }, 2000)
    }




}