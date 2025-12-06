import $ from 'jquery';
import 'bootstrap';
import './component/popover';
import MenuComponent from "./component/menu";

$(function() {
    $(".confirm").click(function(){
        return confirm("Are you sure ?");
    });

    let menu = new MenuComponent();
    menu.init();
});
