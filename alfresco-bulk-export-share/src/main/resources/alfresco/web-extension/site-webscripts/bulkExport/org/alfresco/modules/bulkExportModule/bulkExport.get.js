model.nodeRef = args.nodeRef;
if (args.multiple == "false") {
	model.displayName = args.displayName;
	model.multiple = false;
}else{
	model.multiple = true;
}