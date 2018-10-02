CREATE OR REPLACE FUNCTION audit.select_combobox_province()
 RETURNS refcursor
 LANGUAGE plpgsql
AS $function$
DECLARE
  po_cursor                   REFCURSOR;
BEGIN
	 OPEN po_cursor FOR
       SELECT i_province_code, c_province_name
       FROM dlt_sys_province_code
       ORDER BY ASCII(c_province_name);
       
     RETURN po_cursor;
END 
$function$
