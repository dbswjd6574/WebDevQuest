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
	 if (depth == 1){
		 index[depth]={firstIndex:0, lastIndex:menu.length-1, currentIndex:0};
	 } else if (depth > 1){
		 index[depth]={firstIndex:(index[depth-1].lastIndex)+1, lastIndex:menu.length-1, currentIndex:(index[depth-1].lastIndex)+1};
	 }
}

//왼쪽 메뉴 출력	
function showLeftMenu(depth, keyCode){
	
	var startIdx = index[depth].firstIndex;
	var endIdx = index[depth].lastIndex;
	var currentIdx = index[depth].currentIndex;
	console.log('depth:'+depth)
	console.log('startIdx:'+index[depth].firstIndex);
	console.log('endIdx:'+index[depth].lastIndex);
	console.log('currentIdx:'+index[depth].currentIndex);
	
	if ( ( endIdx - startIdx ) <= 8 ) {
		output = '<ul class="menu_list">'; 
		for (var i = startIdx; i < endIdx ; i++){ 
			output += '<li class="menu_box">'; 
			output += '<span class="menu" style="max-width: 280px;">'; 
			output += menu[i].categoryName+'</span>'; 
			output += '</li>'; 
		} 
		
	} else if ( ( endIdx - startIdx ) > 8 ) {
		
		if ( keyCode == null ){ //초기값
			current_cId=menu[currentIdx].categoryId;
			output='<ul class="menu_list">'; 
			for (var i = startIdx; i < startIdx + 9 ; i++){ 
				output+='<li class="menu_box">'; 
				output+='<span class="menu" style="max-width: 280px;">'; 
				output+=menu[i].categoryName+'</span>'; 
				output+='</li>'; 
			} 
			
		} else if ( keyCode == 40 ){
			
			if ( startIdx <= currentIdx && currentIdx < ( startIdx + 9 ) ) {
				output='<ul class="menu_list">'; 
				for (var i = startIdx; i < startIdx + 9 ; i++){ 
					output+='<li class="menu_box">'; 
					output+='<span class="menu" style="max-width: 280px;">'; 
					output+=menu[i].categoryName+'</span>'; 
					output+='</li>'; 
				} 
				
			} else {
				output='<ul class="menu_list">'; 
				for (var i = currentIdx - 8 ; i < currentIdx + 1 ; i++) { 
					output+='<li class="menu_box">'; 
					output+='<span class="menu" style="max-width: 280px;">'; 
					output+=menu[i].categoryName+'</span>'; 
					output+='</li>'; 
				} 
			} 
			
		} else if ( keyCode == 38 ){
			if ( endIdx - 8 < currentIdx && currentIdx <= endIdx ) {
				output='<ul class="menu_list">'; 
				for (var i = endIdx - 8; i < endIdx + 1 ; i++){ 
					output+='<li class="menu_box">'; 
					output+='<span class="menu" style="max-width: 280px;">'; 
					output+=menu[i].categoryName+'</span>'; 
					output+='</li>'; 
				} 
			} else {
				output='<ul class="menu_list">'; 
				for (var i = currentIdx ; i < currentIdx +9 ; i++){ 
					output+='<li class="menu_box">'; 
					output+='<span class="menu" style="max-width: 280px;">'; 
					output+=menu[i].categoryName+'</span>'; 
					output+='</li>'; 
				} 
				
			}
		} else if ( keyCode == 13 || keyCode == 39 ) {
			
			current_cId=menu[currentIdx].categoryId;
			output='<ul class="menu_list">'; 
			for (var i = startIdx; i < startIdx + 9 ; i++){ 
				output+='<li class="menu_box">'; 
				output+='<span class="menu" style="max-width: 280px;">'; 
				output+=menu[i].categoryName+'</span>'; 
				output+='</li>'; 
			} 
		} 
		
	}
	output+='</ul>'; 
	$(".display_menu_list").html(output); 
	if (currentIdx == startIdx){
		$(".menu_list li").eq(index[depth].currentIndex).attr("class", "menu_box focus");
		
	}

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
		console.log(index[depth].currentIndex);
		if (index[depth].currentIndex >= index[depth].lastIndex){
			
			index[depth].currentIndex = index[depth].firstIndex;
			showLeftMenu(depth, keyCode);
			$(".menu_list li").eq(0).attr("class", "menu_box focus");
		
		} else if (index[depth].currentIndex - index[depth].firstIndex >= 8){
			
			++ index[depth].currentIndex;
			showLeftMenu(depth, keyCode);
			$(".menu_list li").eq(8).attr("class", "menu_box focus");
		} else {
			console.log('3번');
			++ index[depth].currentIndex;
			$(".menu_list li").eq(index[depth].currentIndex - index[depth].firstIndex -1).attr("class", "menu_box");
	 		$(".menu_list li").eq(index[depth].currentIndex - index[depth].firstIndex).attr("class", "menu_box focus");
	
		}
		current_cId = menu[index[depth].currentIndex].categoryId; 
		console.log(current_cId);
		showPreviewList(current_cId);
		
	// 상 키
	} else if (keyCode == 38){ 
		console.log(index[depth].currentIndex);
		// 현재 포커스가 맨 처음 항목에 위치
		if (index[depth].currentIndex <= index[depth].firstIndex){ 
			index[depth].currentIndex = index[depth].lastIndex;
			showLeftMenu(depth, keyCode);
			$(".menu_list li").eq(8).attr("class", "menu_box focus");
	 		
		} else if ( index[depth].currentIndex - (index[depth].lastIndex-8) <= 0){
			console.log('2번');
			--index[depth].currentIndex;
			showLeftMenu(depth, keyCode);
			$(".menu_list li").eq(0).attr("class", "menu_box focus");

		} else if ( 0 < (index[depth].currentIndex - (index[depth].lastIndex-8 )) &&
				(index[depth].currentIndex - (index[depth].lastIndex-8 ) <= 8)){
			console.log('3번');
			--index[depth].currentIndex;
			$(".menu_list li").eq(index[depth].currentIndex+1 - (index[depth].lastIndex-8)).attr("class", "menu_box");
			$(".menu_list li").eq(index[depth].currentIndex - (index[depth].lastIndex-8)).attr("class", "menu_box focus");
		}
		current_cId = menu[index[depth].currentIndex].categoryId; 
		showPreviewList(current_cId);
		
		// 엔터키 or 우키
	} else if (keyCode == 13 || keyCode == 39){ 
		getLeftMenuList(current_cId);
		showLeftMenu(depth, keyCode);
		showPreviewList(current_cId);
		
	} else if (keyCode == 8 || keyCode == 37){ // 백스페이스 or 좌키 : 이전으로 이동
		--depth;
		showLeftMenu(depth, keyCode);
		
	}
}


/**
 * 
 */
