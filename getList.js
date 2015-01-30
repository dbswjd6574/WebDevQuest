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
var x; // 화면에 나타나는 리스트(9개)의 인덱스

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
	 if (depth == 1){
		 index[depth]={firstIndex:0, lastIndex:menu.length-1, currentIndex:0, x:0, output:''};
	 } else if (depth > 1){
		 index[depth]={firstIndex:(index[depth-1].lastIndex)+1, lastIndex:menu.length-1, currentIndex:(index[depth-1].lastIndex)+1, x:0, output:''};
	 }
}

//왼쪽 메뉴 출력	
function showLeftMenu(depth, keyCode){
	
	var startIdx = index[depth].firstIndex;
	var endIdx = index[depth].lastIndex;
	var currentIdx = index[depth].currentIndex;
	if ( ( endIdx - startIdx ) <= 8 ) {
		current_cId=menu[currentIdx].categoryId;
		output = '<ul class="menu_list">'; 
		for (var i = startIdx; i < endIdx + 1 ; i++){ 
			output += '<li class="menu_box">'; 
			output += '<span class="menu" style="max-width: 280px;">'; 
			output += menu[i].categoryName+'</span>'; 
			output += '</li>'; 
		} 
		output+='</ul>'; 
		$(".display_menu_list").html(output); 
	} else if ( ( endIdx - startIdx ) > 8 ) {
		if ( keyCode == null || keyCode == 13 || keyCode == 39){
			currentIdx=startIdx;
			current_cId=menu[currentIdx].categoryId;
			x=0;
			output = '<ul class="menu_list">'; 
			for (var i = startIdx; i < startIdx + 9 ; i++){ 
				output += '<li class="menu_box">'; 
				output += '<span class="menu" style="max-width: 280px;">'; 
				output += menu[i].categoryName+'</span>'; 
				output += '</li>'; 
			}
			output+='</ul>'; 
			$(".display_menu_list").html(output); 
			$(".menu_list li").eq(0).attr("class", "menu_box focus");
			
		} else if ( keyCode == 40 ) {
			if (currentIdx == startIdx) {
				output = '<ul class="menu_list">'; 
				for (var i = startIdx; i < startIdx + 9; i++){ 
					output += '<li class="menu_box">'; 
					output += '<span class="menu" style="max-width: 280px;">'; 
					output += menu[i].categoryName+'</span>'; 
					output += '</li>'; 
				} 
				output+='</ul>'; 
				$(".display_menu_list").html(output); 
			} else {
				output = '<ul class="menu_list">'; 
				for (var i = currentIdx - 8; i < currentIdx + 1; i++){ 
					output += '<li class="menu_box">'; 
					output += '<span class="menu" style="max-width: 280px;">'; 
					output += menu[i].categoryName+'</span>'; 
					output += '</li>'; 
				} 
				output+='</ul>'; 
				$(".display_menu_list").html(output); 
			}
			
		} else if ( keyCode == 38){
			if (currentIdx == endIdx) {
				output = '<ul class="menu_list">'; 
				for (var i = endIdx - 8; i < endIdx + 1; i++){ 
					output += '<li class="menu_box">'; 
					output += '<span class="menu" style="max-width: 280px;">'; 
					output += menu[i].categoryName+'</span>'; 
					output += '</li>'; 
				} 
				output+='</ul>'; 
				$(".display_menu_list").html(output); 
			} else {
				output = '<ul class="menu_list">'; 
				for (var i = currentIdx ; i < currentIdx + 9; i++){ 
					output += '<li class="menu_box">'; 
					output += '<span class="menu" style="max-width: 280px;">'; 
					output += menu[i].categoryName+'</span>'; 
					output += '</li>'; 
				} 
				output+='</ul>'; 
				$(".display_menu_list").html(output); 
			}
		}
	}
	
//	output+='</ul>'; 
//	$(".display_menu_list").html(output); 
//	if (keyCode == null){
//		$(".menu_list li").eq(0).attr("class", "menu_box focus");
//		
//	}

}

//서브메뉴(미리보기) 리스트 생성 - textList로 넘어가는-> Leaf! 
function showPreviewList(id){
	console.log(id);
	param="&categoryId="+id+"&depth=2";
	jsonObj=JSON.parse(loadJSON(param)).categoryList;
		sub_output='<ul class="submenu_list">';
		for (i=1; i<jsonObj.length; i++){
			sub_output+='<li>'+jsonObj[i].categoryName+'</li>';
		}
		sub_output+='</ul>';
		$("#previewList").html(sub_output);
}

// 키보드 이벤트
function pressKeyboard(keyCode){
	// 하 키
	if (keyCode == 40){ 
		console.log('x는:'+x);
		console.log('현재인덱스:'+index[depth].currentIndex);
		
		// 최하위 항목일 때
		if (index[depth].currentIndex >= index[depth].lastIndex){
			console.log('1번');
			index[depth].currentIndex = index[depth].firstIndex;
			showLeftMenu(depth, keyCode);
			$(".menu_list li").eq(0).attr("class", "menu_box focus");
			x=0;
		
		// 포커스 한 칸 아래로 이동
		} else if (0 <= x && x < 8) {
			console.log('2번');
			++index[depth].currentIndex;
			$(".menu_list li").eq(x).attr("class", "menu_box");
			$(".menu_list li").eq(x+1).attr("class", "menu_box focus");
			++x;
			
		// 포커스가 제일 아래에 있어 한 칸씩 밀어야 할 때
		} else if ( x == 8 ){
			console.log('3번');
			++index[depth].currentIndex;
			showLeftMenu(depth, keyCode);
			$(".menu_list li").eq(8).attr("class", "menu_box focus");
			x=8;
		}
		current_cId = menu[index[depth].currentIndex].categoryId; 
		showPreviewList(current_cId);
		
	// 상 키
	} else if (keyCode == 38){ 
		
		// 최상위 항목일 때
		if (index[depth].currentIndex <= index[depth].firstIndex){ 
			index[depth].currentIndex = index[depth].lastIndex;
			showLeftMenu(depth, keyCode);
			$(".menu_list li").eq(8).attr("class", "menu_box focus");
			x=8;
			
		// 포커스 한 칸 위로 이동
		} else if (0 < x && x <= 8) {
			--index[depth].currentIndex;
			$(".menu_list li").eq(x).attr("class", "menu_box");
			$(".menu_list li").eq(x-1).attr("class", "menu_box focus");
			--x;
			
		// 포커스가 제일 위에 있어 한 칸 위로 밀어야 할 때
		} else if ( x == 0){
			--index[depth].currentIndex;
			showLeftMenu(depth, keyCode);
			$(".menu_list li").eq(0).attr("class", "menu_box focus");
			x=0;
		}
		current_cId = menu[index[depth].currentIndex].categoryId; 
		showPreviewList(current_cId);
		
		// 엔터키 or 우키
	} else if (keyCode == 13 || keyCode == 39){ 
		index[depth].x=x;
		index[depth].output=output;
		getLeftMenuList(current_cId);
		showLeftMenu(depth, keyCode);
		showPreviewList(current_cId);
		
	} else if (keyCode == 8 || keyCode == 37){ // 백스페이스 or 좌키 : 이전으로 이동
		for (i=index[depth].lastIndex; i>index[depth].firstIndex-1; i--){
			menu.remove(i);
		}
		--depth;
		output=index[depth].output;
		x=index[depth].x;
		console.log(output);
		$(".display_menu_list").html(output); 
		$(".menu_list li").eq(x).attr("class", "menu_box focus");
		current_cId=menu[index[depth].currentIndex].categoryId;
		showPreviewList(current_cId);
	}
}



/**
 * 
 */
