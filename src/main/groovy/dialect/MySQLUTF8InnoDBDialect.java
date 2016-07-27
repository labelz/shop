package dialect;
import org.hibernate.dialect.MySQLInnoDBDialect;

/**
 * Created by arach on 7/23/2016.
 */
public class MySQLUTF8InnoDBDialect extends MySQLInnoDBDialect {

    @Override
    public String getTableTypeString() {
        return " ENGINE=InnoDB DEFAULT CHARSET=utf8";
    }
}
