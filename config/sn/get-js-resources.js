/* eslint-disable */
/**
 * HTTP method: GET
 * Relative path: /css/{filename}
 * Requires autentication: false
 */
(function process(/* RESTAPIRequest */ request, /* RESTAPIResponse */ response) {
	const {filename} = request.pathParams;
	const thisSysId = '[sys_id of the Scripted REST Resource]';
	const sysAttGR = new GlideRecord('sys_attachment');
	sysAttGR.addQuery('table_sys_id', thisSysId);
	sysAttGR.addQuery('file_name', filename);
	sysAttGR.query();
	if (sysAttGR.next()) {
		const message = new GlideSysAttachment().getContentStream(sysAttGR.getUniqueValue());
		response.setContentType('text/javascript');
		response.setStatus(200);
		response.getStreamWriter().writeStream(message);
	} else {
		response.setStatus(404);
		response.setBody({ message: 'The requested file cannot be found' });
	}
})(request, response);