CREATE OR REPLACE FUNCTION audit.maineye_search_username(pi_username character varying)
 RETURNS refcursor
 LANGUAGE plpgsql
AS $function$
DECLARE
  po_cursor                   REFCURSOR;
BEGIN
    OPEN po_cursor FOR
	    SELECT realname
        FROM   admin_user
      	WHERE LOWER(username) LIKE '%'||COALESCE(LOWER(pi_username),'')||'%';
  RETURN po_cursor;
END
$function$
