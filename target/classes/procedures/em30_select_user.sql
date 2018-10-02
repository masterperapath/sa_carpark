CREATE OR REPLACE FUNCTION audit.em30_select_user(username character varying, groupname character varying)
 RETURNS refcursor
 LANGUAGE plpgsql
AS $function$
DECLARE
  po_cursor                   REFCURSOR;
BEGIN
    OPEN po_cursor FOR
		SELECT (gp.i_group_id) AS i_group_id,c_group_name,c_username,c_password
		FROM user_profile us
		JOIN group_profile gp
		ON us.i_group_id = gp.i_group_id 
		WHERE LOWER(c_group_name) LIKE '%'||COALESCE(LOWER(groupname),'')||'%'
		AND LOWER(c_username) LIKE '%'||COALESCE(LOWER(username),'')||'%';
  RETURN po_cursor;
END
$function$


