// 변수선언
Array.prototype.remove = function (index) {this.splice(index, 1); } //left_arr 초기화 시키기 위한 remove();
var currentIndex=0; // 메뉴 현재 인덱스 값
var lastIndex; //메뉴 리스트의 마지막 인덱스 값
var output; // display_menu 출력부
var sub_output; //sub_menu(preview) 출력부
var current_cId; //현재 해당 categoryId
// 하스 url
var url="http://softstb.cjhellovision.com:8080/HApplicationServer/getCategoryTree.json?version=1&terminalKey=25C5C02283A06C80B1F18FCAB3C36D62";
var param; // 필요한 categoryList 뽑기 위한 파라미터
var menu=null; //왼쪽 메뉴 리스트 저장
var sub_menu=[]; // 미리보기 리스트 저장
var cancel_id; // 이전메뉴로 돌아갈 때 필요한 parentCategoryId


// 하스에서 객체 받아오기
function loadJSON(path, success, error, parentCategoryId, type)
{
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function()
    {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                if (success){
               	 if (type == "menu"){
               		 success(menu=JSON.parse(xhr.responseText).categoryList);
               		 get_display_menu(parentCategoryId);
               	 } else if (type =="preview"){
               		 success(sub_menu=JSON.parse(xhr.responseText).categoryList);
               		 get_SubMenu_Preview(parentCategoryId);
               	 }
                }
            } else {
                if (error)
                    error(xhr);
            }
        }
    };
    xhr.open("GET", path, false); // false; 비동기처리
    xhr.send();
}
// 메뉴 리스트 출력
function display_menu_view(id, menuType){
	 param="&categoryId="+id+"&depth=2";
	 loadJSON(url+param,
			 function(data) { data;	},
	         function(xhr) { console.error(xhr); },
			 id,
			 menuType);
}

//display_menu부 리스트 생성
function get_display_menu(id){ 
	output='<ul class="menu_list">'; 
	for (var i=1; i< menu.length; i++){ 
		output+='<li class="menu_box">'; 
		output+='<span class="menu" style="max-width: 280px;">'; 
		output+=menu[i].categoryName+'</span>'; 
		output+='</li>'; 
	} 
	
	output+='</ul>'; 
	$(".display_menu_list").html(output); 
	$(".menu_list li:first").attr("class", "menu_box focus");// 처음 포커스 잡기 
	
	currentIndex = 0; //현재 인덱스 값 ; 디폴트 0 
	cancel_id = menu[0].parentCategoryId; 
	current_cId = menu[currentIndex+1].categoryId; 
	lastIndex = menu.length -1; //마지막 인덱스 값 

	
}

//서브메뉴(미리보기) 리스트 생성 - textList로 넘어가는 객체 구분자가 뭘까?
function get_SubMenu_Preview(){
		sub_output='<ul class="submenu_list">';
		for (i=1; i<sub_menu.length; i++){
			sub_output+='<li>'+sub_menu[i].categoryName+'</li>';
		}
		sub_output+='</ul>';
		$("#previewList").html(sub_output);
}


// 키보드 이벤트
function pressKeyboard(keyCode){
	// 하 키
	if (keyCode == 40){ 
		// 현재 포커스가 마지막 항목에 위치
	 	if (currentIndex >= lastIndex - 1){ 
	 		$(".menu_list li").eq(currentIndex).attr("class", "menu_box");
			$(".menu_list li").eq(0).attr("class", "menu_box focus");
			currentIndex = 0;
			current_cId=menu[1].categoryId;
	 	} else { // 그 외 
	 		$(".menu_list li").eq(currentIndex).attr("class", "menu_box");
	 		$(".menu_list li").eq(currentIndex+1).attr("class", "menu_box focus");
	 		currentIndex = currentIndex + 1;
	 		current_cId = menu[currentIndex + 1].categoryId;
	 	}
	 	display_menu_view(current_cId, "preview");
		
	// 상 키
	} else if (keyCode == 38){ 
		// 현재 포커스가 맨 처음 항목에 위치
		if (currentIndex <= 0){ 
			$(".menu_list li").eq(currentIndex).attr("class", "menu_box");
			$(".menu_list li").eq(lastIndex - 1).attr("class", "menu_box focus");
	 		currentIndex = lastIndex - 1;
	 		current_cId = menu[currentIndex + 1].categoryId;
	 		
		} else{ // 그 외
			$(".menu_list li").eq(currentIndex).attr("class", "menu_box");
			$(".menu_list li").eq(currentIndex - 1).attr("class", "menu_box focus");
			currentIndex = currentIndex - 1;
			current_cId = menu[currentIndex + 1].categoryId;
		}
		display_menu_view(current_cId, "preview");
		
		// 엔터키 or 우키
	} else if (keyCode == 13 || keyCode == 39){ 
		current_cId = menu[currentIndex + 1].categoryId;
		// 서브 컨텐츠 영역 없는 메뉴일 때 
		for (var i = menu.length; i >= 0; i--) { // 포인터 관련 배열 초기화
			menu.remove(i);
		}
		for (var i = sub_menu.length; i >= 0 ; i--){
			sub_menu.remove(i);
		}
		display_menu_view(current_cId, "menu");
		display_menu_view(current_cId, "preview");
		
	} else if (keyCode == 8 || keyCode == 37){ // 백스페이스 or 좌키 : 이전으로 이동
		current_cId = menu[currentIndex + 1].categoryId;
		for (var i = menu.length; i >= 0; i--) { // 포인터 관련 배열 초기화
			menu.remove(i);
		}
		for (var i = sub_menu.length; i >= 0 ; i--){
			sub_menu.remove(i);
		}
		
		display_menu_view(cancel_id, "menu");
		display_menu_view(current_cId, "preview");
	}
}


/**
 * 
 */
