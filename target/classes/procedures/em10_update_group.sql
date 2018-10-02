CREATE OR REPLACE FUNCTION audit.em10_update_group(pi_groupname character varying, pi_comment character varying, pi_groupid character varying)
 RETURNS refcursor
 LANGUAGE plpgsql
AS $function$
DECLARE
  po_cursor                   REFCURSOR;
BEGIN
	IF  pi_groupid IS NULL THEN      
            INSERT INTO group_profile(i_group_id,c_group_name, c_comment) 
	        VALUES      (NEXTVAL('audit.group_id_seq'),pi_groupname, pi_comment);
    ELSE    
            UPDATE      group_profile
            SET         c_group_name = pi_groupname, c_comment = pi_comment
            WHERE       i_group_id = pi_groupid::NUMERIC;
    END IF;
    RETURN audit.em10_select_group(COALESCE(pi_groupname, NULL),COALESCE(pi_groupid, NULL)); 
END;
$function$
