// 변수선언
Array.prototype.remove = function (index) {this.splice(index, 1); } //left_arr 초기화 시키기 위한 remove();
var currentIndex=0; // 메뉴 현재 인덱스 값
var lastIndex; //메뉴 리스트의 마지막 인덱스 값
var output; // display_menu 출력부
var sub_output; //sub_menu(preview) 출력부
var current_cId; //현재 해당 categoryId
// 하스 url
var path="http://softstb.cjhellovision.com:8080/HApplicationServer/getCategoryTree.json?version=1&terminalKey=25C5C02283A06C80B1F18FCAB3C36D62";
var param; // 필요한 categoryList 뽑기 위한 파라미터
var menu=[]; //왼쪽 메뉴 리스트 저장
var sub_menu=[]; // 미리보기 리스트 저장
var cancel_id; // 이전메뉴로 돌아갈 때 필요한 parentCategoryId
var index=[];
var jsonObj;
var index=[];

function loadJSON(param){
	 return $.ajax({
	    url : path + param,
	    dataType : "json",
	    type : "post",
	    async: false, //동기: false, 비동기: true
	    error:function(request,status,error){
	        alert("code:"+request.status+"\n"+"error:"+error);
	    }
	}).responseText;

}

// 객체 가져오기
function getLeftMenuList(id){
	 param="&categoryId="+id+"&depth=2";
	 jsonObj=JSON.parse(loadJSON(param)).categoryList;
	 depth++;
	 for (var i=1; i<jsonObj.length; i++){
		 menu.push(jsonObj[i]);
		}
	 if (depth==1){
		 index[depth]={firstIndex:0, lastIndex:menu.length-1, currentIndex:0};
	 } else if (depth > 1){
		 index[depth]={firstIndex:(index[depth-1].lastIndex)+1, lastIndex:menu.legnth-1, currentIndex:0};
	 }
}

//왼쪽 메뉴 출력	
function showLeftMenu(depth){
	var startIdx=index[depth].firstIndex;
	var endIdx=index[depth].lastIndex;
	var currentIdx=index[depth].currentIndex;
//	if (0 <= currentIndex && currentIndex < 9){
	
		output='<ul class="menu_list">'; 
		for (var i=0; i<9 ; i++){ 
			output+='<li class="menu_box">'; 
			output+='<span class="menu" style="max-width: 280px;">'; 
			output+=menu[i].categoryName+'</span>'; 
			output+='</li>'; 
		} 
//	}
	output+='</ul>'; 
	$(".display_menu_list").html(output); 
	if (currentIdx==startIdx){
		$(".menu_list li").eq(index[depth].currentIndex).attr("class", "menu_box focus");
//		current_cId = menu[index[depth].currentIndex].categoryId; 
	}
//	currentIndex = 0; //현재 인덱스 값 ; 디폴트 0 
//	cancel_id = menu[0].parentCategoryId; 
	
//	lastIndex = menu.length -1; //마지막 인덱스 값 

}

//서브메뉴(미리보기) 리스트 생성 - textList로 넘어가는 객체 구분자가 뭘까? Leaf! 
// 왜 멈추지..
//function showPreviewList(id){
//	console.log(id);
//		param="&categoryId="+id+"&depth=2";
//		jsonObj=JSON.parse(loadJSON(param)).categoryList;
//		sub_output='<ul class="submenu_list">';
//		for (i=1; i<jsonObj.length; i++){
//			jsonObj+='<li>'+jsonObj[i].categoryName+'</li>';
//		}
//		sub_output+='</ul>';
//		console.
//		$("#previewList").html(sub_output);
//}


// 키보드 이벤트
function pressKeyboard(keyCode){
	// 하 키
	if (keyCode == 40){ 
		console.log(index[depth].currentIndex);
	 	if (index[depth].currentIndex >= index[depth].lastIndex - 1){ 
	 		$(".menu_list li").eq(index[depth].currentIndex).attr("class", "menu_box");
			$(".menu_list li").eq(0).attr("class", "menu_box focus");
			index[depth].currentIndex = 0;
			current_cId=menu[0].categoryId;
			showLeftMenu(depth);
	 	} else if (index[depth].firstIndex <= index[depth].currentIndex &&
	 			index[depth].firstIndex + 9 > index[depth].currentIndex){ // 0~8까지 
	 		$(".menu_list li").eq(index[depth].currentIndex).attr("class", "menu_box");
	 		$(".menu_list li").eq(index[depth].currentIndex+1).attr("class", "menu_box focus");
	 		index[depth].currentIndex++;
	 		current_cId = menu[index[depth].currentIndex].categoryId;
	 	}
//	 	showPreviewList(current_cId);
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
//		display_menu_view(current_cId, "preview");
		
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
