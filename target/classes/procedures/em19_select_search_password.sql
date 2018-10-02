CREATE OR REPLACE FUNCTION audit.em19_select_search_password(pi_username character varying)
 RETURNS refcursor
 LANGUAGE plpgsql
AS $function$
DECLARE
  po_cursor                   REFCURSOR;
  v_sql						  VARCHAR(32000);
BEGIN
  
	OPEN po_cursor FOR
	SELECT	     c_username,
				 c_password
	FROM user_profile
    WHERE c_username =pi_username;

  RETURN po_cursor;
END
$function$
