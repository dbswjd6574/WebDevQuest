/* CategoryList 관련 */

// 왼쪽 메뉴 데이터 배열에 저장
function getCategoryMenuList(id){
	 param="&categoryId="+id+"&depth=2";
	 categoryList=JSON.parse(loadJSON(pathForCategoryList, param)).categoryList;
	 depth++;
	 for (var i=1; i<categoryList.length; i++){
		 menu.push(categoryList[i]);
	 }
	 if (depth == 1){
		 index[depth]={firstIndex:0, lastIndex:menu.length-1, currentIndex:0, x:0, output:''};
	 } else if (depth > 1){
		 index[depth]={firstIndex:(index[depth-1].lastIndex)+1, lastIndex:menu.length-1, currentIndex:(index[depth-1].lastIndex)+1, x:0, output:''};
	 }
}

//왼쪽 메뉴 출력	
function showCategoryMenu(depth){
	
	var startIdx = index[depth].firstIndex;
	var endIdx = index[depth].lastIndex;
	var currentIdx = index[depth].currentIndex;
	
	current_cId=menu[currentIdx].categoryId;
	currentIdx=startIdx;
	x=0;
	if ( ( endIdx - startIdx ) <= 8 ) {
		getCategoryListOutput(startIdx, endIdx + 1);
	} else if ( ( endIdx - startIdx ) > 8 ) {
		getCategoryListOutput(startIdx, startIdx + 9);
	}
	$(".menu_list li").eq(0).attr("class", "menu_box focus");
}

//왼쪽 카테고리 리스트 출력
function getCategoryListOutput(start, end){
	output = '<ul class="menu_list">'; 
	for (var i = start; i < end ; i++){ 
		output += '<li class="menu_box">'; 
		output += '<span class="menu" style="max-width: 280px;">'; 
		output += menu[i].categoryName+'</span>'; 
		output += '</li>'; 
	} 
	output+='</ul>'; 
	$(".display_menu_list").html(output); 
}
