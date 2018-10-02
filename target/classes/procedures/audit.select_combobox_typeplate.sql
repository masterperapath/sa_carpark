CREATE OR REPLACE FUNCTION audit.select_combobox_typeplate()
 RETURNS refcursor
 LANGUAGE plpgsql
AS $function$
DECLARE
  po_cursor                   REFCURSOR;
BEGIN
	 OPEN po_cursor FOR
       SELECT      i_regis_type , c_regis_type_name , c_type_detail
        FROM        dlt_sys_regis_type
        WHERE       is_use = true AND is_show_on_dlt_page = true
        ORDER BY    i_regis_type;
       
     RETURN po_cursor;
END 
$function$